const STATUS_CODES = Object.freeze({
  400: 'BAD_REQUEST',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  413: 'PAYLOAD_TOO_LARGE',
  422: 'VALIDATION_ERROR',
  429: 'RATE_LIMITED',
});

export class ApiError extends Error {
  constructor({
    message,
    status = 0,
    code,
    requestId,
    details,
    cause,
  }) {
    super(message, cause ? { cause } : undefined);
    this.name = 'ApiError';
    this.status = status;
    this.code =
      code ??
      STATUS_CODES[status] ??
      (status >= 500 ? 'SERVER_ERROR' : 'API_ERROR');
    this.requestId = requestId;
    this.details = details;
  }
}

export function apiErrorFromResponse(response, payload) {
  const detail = payload && typeof payload === 'object' ? payload.detail : undefined;
  const message =
    (typeof detail === 'string' && detail) ||
    (typeof payload?.message === 'string' && payload.message) ||
    (typeof payload === 'string' && payload) ||
    `Request failed with status ${response.status}`;

  return new ApiError({
    message,
    status: response.status,
    code: payload?.code ?? payload?.error_code ?? STATUS_CODES[response.status],
    requestId:
      response.headers.get('x-request-id') ??
      response.headers.get('request-id') ??
      response.headers.get('x-correlation-id') ??
      undefined,
    details: payload,
  });
}

export function createNetworkError(cause) {
  return new ApiError({
    message: 'Unable to reach the API. Check your connection and try again.',
    code: 'NETWORK_ERROR',
    cause,
  });
}