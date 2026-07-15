import {httpClient} from './http_client';
import {fetchAdapter} from './fetch_adapter';
import {mockAdapter} from './mock_adapter';
import type {HttpClientConfig} from './types';

let isConfigured = false;

/**
 * Configures the shared HTTP singleton used by all microapp services.
 * Call once at app bootstrap (main app / examples).
 */
export function configureHttpClient(config: HttpClientConfig = {}): void {
  httpClient.configure({
    baseURL: config.baseURL ?? '',
    defaultHeaders: config.defaultHeaders,
    adapter: config.adapter ?? mockAdapter,
    getAuthToken: config.getAuthToken ?? (() => null),
  });
  if (!isConfigured) {
    httpClient.useRequestInterceptor(config => {
      return {
        ...config,
        headers: {
          ...config.headers,
          'X-Client': 'shared-rn-http',
        },
      };
    });
    httpClient.useResponseInterceptor(response => response);
    httpClient.useErrorInterceptor(error => {
      throw error;
    });
    isConfigured = true;
  }
}

/**
 * Ensures a default POC setup (mock adapter + interceptors) if the host
 * app forgot to call `configureHttpClient`.
 */
export function ensureHttpClientConfigured(): void {
  if (!isConfigured) {
    configureHttpClient({adapter: mockAdapter});
  }
}

export function useFetchAdapter(): void {
  ensureHttpClientConfigured();
  httpClient.configure({adapter: fetchAdapter});
}

export function useMockAdapter(): void {
  ensureHttpClientConfigured();
  httpClient.configure({adapter: mockAdapter});
}
