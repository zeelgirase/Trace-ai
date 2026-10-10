import { ApiError } from './apiError.js';
import { apiClient } from './apiClient.js';
import { apiRoutes } from './apiRoutes.js';

export const MAX_UPLOAD_SIZE_BYTES = 100 * 1024 * 1024;
export const SUPPORTED_UPLOAD_EXTENSIONS = Object.freeze([
  '.csv',
  '.xlsx',
  '.xls',
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.tiff',
]);

/**
 * @typedef {{ id: string, engagement_id: string, original_filename: string, file_type: string, size_bytes: number, sha256_hash: string, upload_timestamp: string, version_number: number }} UploadedArtifact
 * @typedef {{ invoice_number?: string, count: number, rows: number[] }} DuplicateCandidate
 * @typedef {{ earliest?: string, latest?: string }} ValidationDateRange
 * @typedef {{ valid: boolean, errors: string[], warnings: string[], duplicate_candidates: DuplicateCandidate[], total_records: number, total_amount?: number, date_range?: ValidationDateRange, missing_fields: string[] }} UploadValidationResult
 */

function validateUploadFile(file) {
  if (!file || typeof file.name !== 'string' || typeof file.size !== 'number') {
    throw new TypeError('A file with a name and size is required');
  }

  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!SUPPORTED_UPLOAD_EXTENSIONS.includes(extension)) {
    throw new ApiError({
      message: `Unsupported file type. Allowed extensions: ${SUPPORTED_UPLOAD_EXTENSIONS.join(', ')}`,
      status: 400,
      code: 'UNSUPPORTED_FILE_TYPE',
    });
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new ApiError({
      message: 'File size exceeds the documented 100 MB limit',
      status: 400,
      code: 'FILE_TOO_LARGE',
    });
  }
}

export function createUploadService(client = apiClient) {
  return Object.freeze({
    /** @param {string} engagementId @param {File} file @returns {Promise<UploadedArtifact>} */
    async uploadFile(engagementId, file, options) {
      validateUploadFile(file);
      const formData = new FormData();
      formData.append('file', file);
      return client.request(apiRoutes.uploads.upload(engagementId), {
        ...options,
        body: formData,
      });
    },

    /** @param {string} engagementId @returns {Promise<UploadedArtifact[]>} */
    async listUploads(engagementId, options) {
      return client.request(apiRoutes.uploads.list(engagementId), options);
    },

    /** @param {string} engagementId @param {string} artifactId @returns {Promise<UploadValidationResult>} */
    async validateUpload(engagementId, artifactId, options) {
      return client.request(apiRoutes.uploads.validate(engagementId, artifactId), options);
    },
  });
}

export const uploadService = createUploadService();
