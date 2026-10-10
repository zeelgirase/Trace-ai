import { ApiError, apiErrorFromResponse, createNetworkError } from './apiError.js';

const DEFAULT_API_BASE_URL = 'http://localhost:8000/api/v1';
const AUTH_TOKEN_KEY = 'trace_access_token';
const AUTH_REQUIRED_EVENT = 'trace:authentication-required';

function configuredBaseUrl() {
  return import.meta.env?.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
}

function normalizeBaseUrl(baseUrl) {
  const normalized = String(baseUrl).trim().replace(/\/+$/, '');
  if (!normalized) {
    throw new TypeError('API base URL must not be empty');
  }

  return normalized;
}

function makeUrl(baseUrl, endpoint, query) {
  const apiBaseUrl = normalizeBaseUrl(baseUrl);
  const base = endpoint.base === 'origin' ? new URL(apiBaseUrl).origin : apiBaseUrl;
  const url = new URL(`${base}${endpoint.path}`);

  if (query) {
    const entries =
      query instanceof URLSearchParams
        ? query.entries()
        : Object.entries(query);

    for (const [key, value] of entries) {
      if (value === undefined || value === null) continue;
      const values = Array.isArray(value) ? value : [value];
      for (const item of values) {
        if (item !== undefined && item !== null) {
          url.searchParams.append(key, String(item));
        }
      }
    }
  }

  return url;
}

function parseResponseBody(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getStorage() {
  return typeof globalThis.localStorage === 'undefined'
    ? null
    : globalThis.localStorage;
}

function dispatchAuthenticationRequired(eventTarget) {
  if (eventTarget && typeof eventTarget.dispatchEvent === 'function') {
    eventTarget.dispatchEvent(new Event(AUTH_REQUIRED_EVENT));
  }
}

export function createApiClient({
  baseUrl = configuredBaseUrl(),
  fetchImpl = globalThis.fetch,
  storage = getStorage(),
  eventTarget = globalThis.window,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new TypeError('A Fetch API implementation is required');
  }

  function getAuthToken() {
    return storage?.getItem(AUTH_TOKEN_KEY) ?? null;
  }

  function setAuthToken(token) {
    if (typeof token !== 'string' || token.length === 0) {
      throw new TypeError('Authentication token must be a non-empty string');
    }
    if (!storage) {
      throw new Error('Browser storage is unavailable; cannot persist authentication');
    }
    storage.setItem(AUTH_TOKEN_KEY, token);
  }

  function clearAuthToken() {
    storage?.removeItem(AUTH_TOKEN_KEY);
  }

  async function request(endpoint, options = {}) {
    if (!endpoint || typeof endpoint.path !== 'string') {
      throw new TypeError('A registered API route is required');
    }

    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');

    const token = options.token ?? getAuthToken();
    if (endpoint.authentication !== 'none' && token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let body = options.body;
    const isFormData =
      typeof FormData !== 'undefined' && body instanceof FormData;
    if (isFormData) {
      headers.delete('Content-Type');
    }
    if (
      body !== undefined &&
      body !== null &&
      !isFormData &&
      typeof body !== 'string'
    ) {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(body);
    }

    let response;
    try {
      response = await fetchImpl(makeUrl(baseUrl, endpoint, options.query), {
        method: endpoint.method,
        headers,
        body,
        signal: options.signal,
      });
    } catch (error) {
      if (error?.name === 'AbortError') throw error;
      throw createNetworkError(error);
    }

    const payload = parseResponseBody(await response.text());

    if (!response.ok) {
      const error = apiErrorFromResponse(response, payload);
      if (response.status === 401) {
        clearAuthToken();
        dispatchAuthenticationRequired(eventTarget);
      }
      throw error;
    }

    return payload;
  }

  return Object.freeze({
    request,
    getAuthToken,
    setAuthToken,
    clearAuthToken,
  });
}

export const apiClient = createApiClient();
export { AUTH_REQUIRED_EVENT, AUTH_TOKEN_KEY, DEFAULT_API_BASE_URL };