import {fetchAdapter} from './fetch_adapter';
import type {
  ErrorInterceptor,
  HttpAdapter,
  HttpClientConfig,
  HttpHeaders,
  HttpMethod,
  HttpRequestConfig,
  HttpResponse,
  RequestInterceptor,
  ResponseInterceptor,
} from './types';

type RequestOptions = {
  headers?: HttpHeaders;
  params?: HttpRequestConfig['params'];
  signal?: AbortSignal;
};

/**
 * Shared HTTP client with request/response/error interceptors.
 * All microapp `services/` MUST use this client for transport.
 */
export class HttpClient {
  private baseURL: string = '';
  private defaultHeaders: HttpHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  private adapter: HttpAdapter = fetchAdapter;
  private getAuthToken:
    | (() => Promise<string | null> | string | null)
    | null = null;
  private readonly requestInterceptors: RequestInterceptor[] = [];
  private readonly responseInterceptors: ResponseInterceptor[] = [];
  private readonly errorInterceptors: ErrorInterceptor[] = [];
  private hasDefaultAuthInterceptor = false;

  configure(config: HttpClientConfig): void {
    if (config.baseURL !== undefined) {
      this.baseURL = config.baseURL;
    }
    if (config.defaultHeaders) {
      this.defaultHeaders = {
        ...this.defaultHeaders,
        ...config.defaultHeaders,
      };
    }
    if (config.adapter) {
      this.adapter = config.adapter;
    }
    if (config.getAuthToken) {
      this.getAuthToken = config.getAuthToken;
      this.ensureAuthInterceptor();
    }
  }

  useRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  useResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  useErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  async get<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('GET', url, undefined, options);
  }

  async post<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('POST', url, body, options);
  }

  async put<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', url, body, options);
  }

  async patch<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PATCH', url, body, options);
  }

  async delete<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  private ensureAuthInterceptor(): void {
    if (this.hasDefaultAuthInterceptor) {
      return;
    }
    this.hasDefaultAuthInterceptor = true;
    this.requestInterceptors.unshift(async config => {
      if (!this.getAuthToken) {
        return config;
      }
      const token = await this.getAuthToken();
      if (!token) {
        return config;
      }
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    });
  }

  private resolveUrl(url: string): string {
    if (/^https?:\/\//i.test(url) || this.baseURL.length === 0) {
      return url;
    }
    return `${this.baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  }

  private async request<T>(
    method: HttpMethod,
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    let config: HttpRequestConfig = {
      method,
      url: this.resolveUrl(url),
      headers: {
        ...this.defaultHeaders,
        ...(options?.headers ?? {}),
      },
      body,
      params: options?.params,
      signal: options?.signal,
    };
    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }
    try {
      let response = await this.adapter(config);
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }
      return response as HttpResponse<T>;
    } catch (error) {
      let current: unknown = error;
      for (const interceptor of this.errorInterceptors) {
        current = await interceptor(current);
      }
      throw current;
    }
  }
}

export const httpClient = new HttpClient();
