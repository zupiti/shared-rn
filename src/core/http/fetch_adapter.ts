import {HttpError} from './http_error';
import type {HttpAdapter, HttpHeaders, HttpRequestConfig, HttpResponse} from './types';

function buildUrl(
  baseURL: string,
  url: string,
  params?: HttpRequestConfig['params'],
): string {
  const isAbsolute = /^https?:\/\//i.test(url);
  const joined = isAbsolute
    ? url
    : `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  if (!params) {
    return joined;
  }
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    search.append(key, String(value));
  });
  const query = search.toString();
  if (query.length === 0) {
    return joined;
  }
  return joined.includes('?') ? `${joined}&${query}` : `${joined}?${query}`;
}

function normalizeHeaders(raw: Headers): HttpHeaders {
  const headers: HttpHeaders = {};
  raw.forEach((value: string, key: string) => {
    headers[key] = value;
  });
  return headers;
}

/**
 * Default transport — real network via fetch.
 */
export const fetchAdapter: HttpAdapter = async (
  config: HttpRequestConfig,
): Promise<HttpResponse> => {
  const url = buildUrl('', config.url, config.params);
  const init: RequestInit = {
    method: config.method,
    headers: config.headers,
    signal: config.signal,
  };
  if (config.body !== undefined && config.method !== 'GET') {
    init.body = JSON.stringify(config.body);
  }
  const response = await fetch(url, init);
  const contentType = response.headers.get('content-type') ?? '';
  let data: unknown = null;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text.length > 0 ? text : null;
  }
  const httpResponse: HttpResponse = {
    data,
    status: response.status,
    headers: normalizeHeaders(response.headers),
    config,
  };
  if (!response.ok) {
    throw HttpError.fromResponse(httpResponse);
  }
  return httpResponse;
};
