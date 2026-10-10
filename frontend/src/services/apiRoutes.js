const API_STATUS = 'DOCUMENTED';
const API_GROUP_NAMES = [
  'health',
  'auth',
  'users',
  'organizations',
  'engagements',
  'dashboard',
  'uploads',
  'jobs',
  'datasets',
  'records',
  'submissions',
  'ledger',
  'reconciliation',
  'relatedParties',
  'counterparties',
  'duplicates',
  'riskAssessments',
  'sampling',
  'evidence',
  'auditTests',
  'anomalies',
  'investigations',
  'findings',
  'workpapers',
  'reviews',
  'signOff',
  'auditTrail',
  'integrity',
  'changeImpact',
  'reports',
  'exports',
  'notifications',
  'admin',
  'agentIdentities',
  'mcp',
  'metadata',
];

function route(method, path, authentication = 'required', base = 'api') {
  return Object.freeze({ method, path, authentication, base, status: API_STATUS });
}

function pathSegment(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${name} must be a non-empty string`);
  }

  return encodeURIComponent(value);
}

const implementedRouteGroups = {
  health: Object.freeze({
    check: route('GET', '/health', 'none', 'origin'),
  }),
  auth: Object.freeze({
    register: route('POST', '/auth/register', 'none'),
    login: route('POST', '/auth/login', 'none'),
    currentUser: route('GET', '/auth/me'),
  }),
  engagements: Object.freeze({
    create: route('POST', '/engagements/'),
    list: route('GET', '/engagements/'),
    byId: (engagementId) =>
      route('GET', `/engagements/${pathSegment(engagementId, 'engagementId')}`),
    update: (engagementId) =>
      route('PATCH', `/engagements/${pathSegment(engagementId, 'engagementId')}`),
  }),
  uploads: Object.freeze({
    upload: (engagementId) =>
      route(
        'POST',
        `/uploads/${pathSegment(engagementId, 'engagementId')}/upload`,
      ),
    list: (engagementId) =>
      route(
        'GET',
        `/uploads/${pathSegment(engagementId, 'engagementId')}/uploads`,
      ),
    validate: (engagementId, artifactId) =>
      route(
        'POST',
        `/uploads/${pathSegment(engagementId, 'engagementId')}/validate/${pathSegment(artifactId, 'artifactId')}`,
      ),
  }),
};

export const apiRoutes = Object.freeze(
  Object.fromEntries(
    API_GROUP_NAMES.map((groupName) => [
      groupName,
      implementedRouteGroups[groupName] ?? Object.freeze({}),
    ]),
  ),
);

export const endpointGroupStatus = Object.freeze(
  Object.fromEntries(
    API_GROUP_NAMES.map((groupName) => [
      groupName,
      implementedRouteGroups[groupName] ? API_STATUS : 'PLANNED',
    ]),
  ),
);

export const API_GROUP_NAMES_LIST = Object.freeze([...API_GROUP_NAMES]);