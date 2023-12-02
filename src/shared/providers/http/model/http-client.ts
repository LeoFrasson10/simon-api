import { Result } from 'types-ddd';

enum HttpStatusCode {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  serverError = 500,
}

export type HttpMethod = 'post' | 'get' | 'put' | 'delete' | 'patch';

export type HttpResponse<T = any> = {
  statusCode: HttpStatusCode;
  response?: T;
};

export type Modules = 'spin' | 'waiver' | 'acquiring' | 'apollo' | 'sputnik';

export type HttpRequest<Body> = {
  url: string;
  method: HttpMethod;
  body?: Body;
  params?: any;
  query?: any;
  headers?: any;
  responseType?: 'json';
};

export type HttpRequestExternalModule<Body> = HttpRequest<Body> & {
  module: Modules;
  integrationId?: string;
};

export interface IHttpClient {
  request<Body = any, Response = any>(
    data: HttpRequest<Body>,
  ): Promise<Result<HttpResponse<Response>>>;
  requestExternalModule<Body = any, Response = any>(
    data: HttpRequestExternalModule<Body>,
  ): Promise<Result<HttpResponse<Response>>>;
}
