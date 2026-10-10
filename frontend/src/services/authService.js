import { apiClient } from './apiClient.js';
import { apiRoutes } from './apiRoutes.js';

export const USER_ROLES = Object.freeze([
  'CLIENT_EMPLOYEE',
  'INDEPENDENT_AI_AUDITOR',
  'HUMAN_AUDITOR',
  'PLATFORM_ADMIN',
]);

/**
 * @typedef {'CLIENT_EMPLOYEE' | 'INDEPENDENT_AI_AUDITOR' | 'HUMAN_AUDITOR' | 'PLATFORM_ADMIN'} UserRole
 * @typedef {{ username: string, password: string }} LoginRequest
 * @typedef {{ username: string, email: string, password: string, role: UserRole, full_name?: string }} RegisterRequest
 * @typedef {{ access_token: string, token_type: string }} LoginResponse
 * @typedef {{ id: string, username: string, email: string, role: UserRole, full_name?: string, is_active: boolean, created_at: string }} CurrentUser
 */

function validateObjectFields(value, requiredFields, optionalFields, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }

  for (const field of requiredFields) {
    if (typeof value[field] !== 'string' || value[field].length === 0) {
      throw new TypeError(`${label}.${field} must be a non-empty string`);
    }
  }

  const allowedFields = new Set([...requiredFields, ...optionalFields]);
  const unsupportedFields = Object.keys(value).filter(
    (field) => !allowedFields.has(field),
  );
  if (unsupportedFields.length > 0) {
    throw new TypeError(
      `${label} contains unsupported fields: ${unsupportedFields.join(', ')}`,
    );
  }
}

function validateRegistration(data) {
  validateObjectFields(
    data,
    ['username', 'email', 'password', 'role'],
    ['full_name'],
    'Registration request',
  );
  if (!USER_ROLES.includes(data.role)) {
    throw new TypeError(`Registration role must be one of: ${USER_ROLES.join(', ')}`);
  }
  if (data.full_name !== undefined && typeof data.full_name !== 'string') {
    throw new TypeError('Registration request.full_name must be a string');
  }
}

export function createAuthService(client = apiClient) {
  return Object.freeze({
    async register(data, options) {
      validateRegistration(data);
      return client.request(apiRoutes.auth.register, { ...options, body: data });
    },

    async login(credentials, options) {
      validateObjectFields(
        credentials,
        ['username', 'password'],
        [],
        'Login request',
      );
      const result = await client.request(apiRoutes.auth.login, {
        ...options,
        body: credentials,
      });
      if (!result || typeof result.access_token !== 'string' || !result.access_token) {
        throw new TypeError('Login response did not include an access_token');
      }
      client.setAuthToken(result.access_token);
      return result;
    },

    async getCurrentUser(options) {
      return client.request(apiRoutes.auth.currentUser, options);
    },

    logout() {
      client.clearAuthToken();
    },
  });
}

export const authService = createAuthService();
