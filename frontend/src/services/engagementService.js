import { apiClient } from './apiClient.js';
import { apiRoutes } from './apiRoutes.js';

const UPDATEABLE_METADATA_FIELDS = new Set(['name', 'description']);

/**
 * @typedef {{ name: string, client_name: string, reporting_period_start: string, reporting_period_end: string, description?: string }} CreateEngagementRequest
 * @typedef {{ id: string, name: string, client_name: string, client_user_id?: string, reporting_period_start: string, reporting_period_end: string, status: string, description?: string, created_at: string, updated_at: string }} Engagement
 * @typedef {{ name?: string, description?: string }} EngagementMetadataUpdate
 */

function metadataOnly(update) {
  if (!update || typeof update !== 'object' || Array.isArray(update)) {
    throw new TypeError('Engagement metadata must be an object');
  }

  const fields = Object.keys(update);
  const unsupported = fields.filter((field) => !UPDATEABLE_METADATA_FIELDS.has(field));
  if (unsupported.length > 0) {
    throw new TypeError(
      `Engagement updates may only change name or description; unsupported: ${unsupported.join(', ')}`,
    );
  }
  if (fields.length === 0) {
    throw new TypeError('At least one engagement metadata field is required');
  }
  for (const field of fields) {
    if (typeof update[field] !== 'string') {
      throw new TypeError(`Engagement metadata ${field} must be a string`);
    }
  }

  return update;
}

function validateCreateRequest(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new TypeError('Engagement creation request must be an object');
  }
  const requiredFields = [
    'name',
    'client_name',
    'reporting_period_start',
    'reporting_period_end',
  ];
  for (const field of requiredFields) {
    if (typeof data[field] !== 'string' || data[field].length === 0) {
      throw new TypeError(
        `Engagement creation request.${field} must be a non-empty string`,
      );
    }
  }
  const allowedFields = new Set([...requiredFields, 'description']);
  const unsupportedFields = Object.keys(data).filter(
    (field) => !allowedFields.has(field),
  );
  if (unsupportedFields.length > 0) {
    throw new TypeError(
      `Engagement creation request contains unsupported fields: ${unsupportedFields.join(', ')}`,
    );
  }
  if (data.description !== undefined && typeof data.description !== 'string') {
    throw new TypeError('Engagement creation request.description must be a string');
  }
}

export function createEngagementService(client = apiClient) {
  return Object.freeze({
    /** @param {CreateEngagementRequest} data */
    async create(data, options) {
      validateCreateRequest(data);
      return client.request(apiRoutes.engagements.create, {
        ...options,
        body: data,
      });
    },

    /** @returns {Promise<Engagement[]>} */
    async list(options) {
      return client.request(apiRoutes.engagements.list, options);
    },

    /** @param {string} engagementId @returns {Promise<Engagement>} */
    async getById(engagementId, options) {
      return client.request(apiRoutes.engagements.byId(engagementId), options);
    },

    /** @param {string} engagementId @param {EngagementMetadataUpdate} update */
    async updateMetadata(engagementId, update, options) {
      return client.request(apiRoutes.engagements.update(engagementId), {
        ...options,
        body: metadataOnly(update),
      });
    },
  });
}

export const engagementService = createEngagementService();
