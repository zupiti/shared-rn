import type {HttpRequestConfig, HttpResponse} from './types';

/**
 * Normalized HTTP error thrown by the shared request core.
 */
export class HttpError extends Error {
  readonly status: number;
  readonly config: HttpRequestConfig;
  readonly data: unknown;

  constructor(params: {
    message: string;
    status: number;
    config: HttpRequestConfig;
    data?: unknown;
  }) {
    super(params.message);
    this.name = 'HttpError';
    this.status = params.status;
    this.config = params.config;
    this.data = params.data ?? null;
  }

  static fromResponse(response: HttpResponse): HttpError {
    const message =
      typeof response.data === 'object' &&
      response.data !== null &&
      'message' in response.data &&
      typeof (response.data as {message?: unknown}).message === 'string'
        ? (response.data as {message: string}).message
        : `HTTP ${response.status}`;
    return new HttpError({
      message,
      status: response.status,
      config: response.config,
      data: response.data,
    });
  }
}
