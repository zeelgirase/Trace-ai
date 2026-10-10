import assert from 'node:assert/strict';
import test from 'node:test';
import { ApiError } from './apiError.js';
import {
  AUTH_REQUIRED_EVENT,
  AUTH_TOKEN_KEY,
  createApiClient,
} from './apiClient.js';
import { createAuthService } from './authService.js';
import { createEngagementService } from './engagementService.js';
import { auditCapabilities } from './apiCapabilities.js';
import { apiRoutes, endpointGroupStatus } from './apiRoutes.js';
import { createUploadService } from './uploadService.js';

function makeStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

function makeResponse(body, { status = 200, headers = {} } = {}) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

test('registry builds documented paths and safely encodes dynamic identifiers', () => {
  assert.equal(apiRoutes.health.check.path, '/health');
  assert.equal(apiRoutes.auth.login.path, '/auth/login');
  assert.equal(apiRoutes.engagements.create.path, '/engagements/');
  assert.equal(apiRoutes.engagements.byId('eng/a').path, '/engagements/eng%2Fa');
  assert.equal(
    apiRoutes.uploads.validate('eng-1', 'art 2').path,
    '/uploads/eng-1/validate/art%202',
  );
  assert.throws(() => apiRoutes.engagements.byId(''), TypeError);
  assert.equal(endpointGroupStatus.reconciliation, 'PLANNED');
  assert.ok(
    auditCapabilities.every(
      (capability) =>
        capability.status === 'PLANNED' &&
        capability.message.startsWith('Unavailable:'),
    ),
  );
});

test('request uses configured API prefix, token, JSON content type, query and cancellation', async () => {
  const storage = makeStorage({ [AUTH_TOKEN_KEY]: 'secret-token' });
  const controller = new AbortController();
  let observed;
  const client = createApiClient({
    baseUrl: 'https://trace.example/api/v1/',
    storage,
    fetchImpl: async (url, options) => {
      observed = { url: String(url), options };
      return makeResponse([]);
    },
  });

  await client.request(apiRoutes.engagements.list, {
    query: { status: 'draft', page: 2, tags: ['one', 'two'], omit: null },
    signal: controller.signal,
  });

  const parsedUrl = new URL(observed.url);
  assert.equal(parsedUrl.pathname, '/api/v1/engagements/');
  assert.equal(parsedUrl.searchParams.get('page'), '2');
  assert.deepEqual(parsedUrl.searchParams.getAll('tags'), ['one', 'two']);
  assert.equal(parsedUrl.searchParams.has('omit'), false);
  assert.equal(observed.options.headers.get('Authorization'), 'Bearer secret-token');
  assert.equal(observed.options.headers.get('Content-Type'), null);
  assert.equal(observed.options.signal, controller.signal);
});

test('health calls the service origin without authentication', async () => {
  let observed;
  const client = createApiClient({
    baseUrl: 'https://trace.example/api/v1',
    storage: makeStorage({ [AUTH_TOKEN_KEY]: 'secret-token' }),
    fetchImpl: async (url, options) => {
      observed = { url: String(url), options };
      return makeResponse({ status: 'healthy' });
    },
  });

  await client.request(apiRoutes.health.check);

  assert.equal(new URL(observed.url).pathname, '/health');
  assert.equal(observed.options.headers.get('Authorization'), null);
});

test('FormData uploads do not set multipart content type manually', async () => {
  let observed;
  const client = createApiClient({
    baseUrl: 'http://localhost:8000/api/v1',
    storage: makeStorage(),
    fetchImpl: async (_url, options) => {
      observed = options;
      return makeResponse({ id: 'artifact-1' });
    },
  });
  const service = createUploadService(client);

  await service.uploadFile('eng-1', new File(['invoice'], 'sales.csv'));

  assert.equal(observed.body.get('file').name, 'sales.csv');
  assert.equal(observed.headers.get('Content-Type'), null);
});

test('401 clears saved token, dispatches auth event, and preserves request id', async () => {
  const storage = makeStorage({ [AUTH_TOKEN_KEY]: 'expired-token' });
  const events = [];
  const client = createApiClient({
    storage,
    eventTarget: { dispatchEvent: (event) => events.push(event.type) },
    fetchImpl: async () =>
      makeResponse(
        { detail: 'Could not validate credentials' },
        { status: 401, headers: { 'x-request-id': 'req-123' } },
      ),
  });

  await assert.rejects(client.request(apiRoutes.auth.currentUser), (error) => {
    assert.ok(error instanceof ApiError);
    assert.equal(error.status, 401);
    assert.equal(error.code, 'UNAUTHENTICATED');
    assert.equal(error.requestId, 'req-123');
    return true;
  });
  assert.equal(storage.getItem(AUTH_TOKEN_KEY), null);
  assert.deepEqual(events, [AUTH_REQUIRED_EVENT]);
});

test('403 preserves backend error code and message', async () => {
  const client = createApiClient({
    storage: makeStorage(),
    fetchImpl: async () =>
      makeResponse(
        { detail: 'No permission', error_code: 'role_denied' },
        { status: 403 },
      ),
  });
  await assert.rejects(client.request(apiRoutes.engagements.list), (error) => {
    assert.equal(error.status, 403);
    assert.equal(error.code, 'role_denied');
    assert.equal(error.message, 'No permission');
    return true;
  });
});

test('non-JSON error and empty successful response are handled', async () => {
  const responses = [
    new Response('upstream unavailable', {
      status: 500,
      headers: { 'x-correlation-id': 'corr-8' },
    }),
    new Response(null, { status: 204 }),
  ];
  const client = createApiClient({
    storage: makeStorage(),
    fetchImpl: async () => responses.shift(),
  });

  await assert.rejects(client.request(apiRoutes.engagements.list), (error) => {
    assert.equal(error.status, 500);
    assert.equal(error.code, 'SERVER_ERROR');
    assert.equal(error.message, 'upstream unavailable');
    assert.equal(error.requestId, 'corr-8');
    return true;
  });
  assert.equal(await client.request(apiRoutes.engagements.list), null);
});

test('network errors are explicit and abort errors remain cancellation errors', async () => {
  const client = createApiClient({
    storage: makeStorage(),
    fetchImpl: async () => {
      throw new TypeError('connection refused');
    },
  });

  await assert.rejects(client.request(apiRoutes.engagements.list), (error) => {
    assert.equal(error.code, 'NETWORK_ERROR');
    assert.equal(error.status, 0);
    return true;
  });

  const controller = new AbortController();
  controller.abort();
  const abortedClient = createApiClient({ storage: makeStorage() });
  await assert.rejects(
    abortedClient.request(apiRoutes.engagements.list, { signal: controller.signal }),
    (error) => {
      assert.equal(error.name, 'AbortError');
      return true;
    },
  );
});

test('auth service sends documented username/password fields and stores returned token', async () => {
  const calls = [];
  const storage = makeStorage();
  const client = createApiClient({
    storage,
    fetchImpl: async (_url, options) => {
      calls.push({ options, body: JSON.parse(options.body) });
      return makeResponse({ access_token: 'fresh', token_type: 'bearer' });
    },
  });
  const auth = createAuthService(client);

  await auth.login({ username: 'client_user', password: 'secret' });

  assert.deepEqual(calls[0].body, {
    username: 'client_user',
    password: 'secret',
  });
  assert.equal(storage.getItem(AUTH_TOKEN_KEY), 'fresh');
  auth.logout();
  assert.equal(storage.getItem(AUTH_TOKEN_KEY), null);
});

test('auth service enforces documented fields and registration roles', async () => {
  const auth = createAuthService({
    request: async () => ({ id: 'user-1' }),
    setAuthToken: () => {},
    clearAuthToken: () => {},
  });

  await assert.rejects(
    auth.register({
      username: 'client',
      email: 'client@example.com',
      password: 'secret',
      role: 'CLIENT',
    }),
    /Registration role must be one of/,
  );
  await assert.rejects(
    auth.login({ email: 'client@example.com', password: 'secret' }),
    /Login request.username must be a non-empty string/,
  );
});

test('engagement updates cannot bypass workflow status through metadata service', async () => {
  const service = createEngagementService({
    request: async (_route, options) => options.body,
  });
  await assert.rejects(
    service.create({
      name: 'Audit',
      client_name: 'Client',
      reporting_period_start: '2026-01-01T00:00:00Z',
      reporting_period_end: '2026-12-31T23:59:59Z',
      status: 'approved_final',
    }),
    /Engagement creation request contains unsupported fields: status/,
  );
  await assert.rejects(
    service.updateMetadata('eng-1', { status: 'approved_final' }),
    /may only change name or description/,
  );
  assert.deepEqual(
    await service.updateMetadata('eng-1', { description: 'Corrected' }),
    { description: 'Corrected' },
  );
});

test('upload service validates documented extension and size limits', async () => {
  let sent = false;
  const service = createUploadService({
    request: async () => {
      sent = true;
      return {};
    },
  });
  await assert.rejects(
    service.uploadFile('eng-1', new File(['x'], 'payload.docx')),
    (error) => error.code === 'UNSUPPORTED_FILE_TYPE',
  );
  await assert.rejects(
    service.uploadFile('eng-1', {
      name: 'large.csv',
      size: 100 * 1024 * 1024 + 1,
    }),
    (error) => error.code === 'FILE_TOO_LARGE',
  );
  assert.equal(sent, false);
});
