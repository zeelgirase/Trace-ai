import { apiClient } from './apiClient.js';
import { apiRoutes } from './apiRoutes.js';

/**
 * @typedef {{ status: string, timestamp?: string, version?: string, llm_available?: boolean, ocr_available?: boolean }} HealthResponse
 */

export function createHealthService(client = apiClient) {
  return Object.freeze({
    /** @returns {Promise<HealthResponse>} */
    check(options) {
      return client.request(apiRoutes.health.check, options);
    },
  });
}

export const healthService = createHealthService();
