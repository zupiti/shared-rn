export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpHeaders = Record<string, string>;

export type HttpRequestConfig = {
  url: string;
  method: HttpMethod;
  headers: HttpHeaders;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
};

export type HttpResponse<T = unknown> = {
  data: T;
  status: number;
  headers: HttpHeaders;
  config: HttpRequestConfig;
};

export type HttpAdapter = (
  config: HttpRequestConfig,
) => Promise<HttpResponse>;

export type RequestInterceptor = (
  config: HttpRequestConfig,
) => HttpRequestConfig | Promise<HttpRequestConfig>;

export type ResponseInterceptor = (
  response: HttpResponse,
) => HttpResponse | Promise<HttpResponse>;

export type ErrorInterceptor = (error: unknown) => Promise<never> | never;

export type HttpClientConfig = {
  baseURL?: string;
  defaultHeaders?: HttpHeaders;
  adapter?: HttpAdapter;
  getAuthToken?: () => Promise<string | null> | string | null;
};
