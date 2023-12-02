import { HttpService } from '@nestjs/axios';
import { server, services } from '@shared/config';
import axios from 'axios';
import { Result } from 'types-ddd';
import {
  IHttpClient,
  HttpResponse,
  HttpRequest,
  HttpRequestExternalModule,
} from '../model';

export class NestJSAxios implements IHttpClient {
  public async request<Body = any, Response = any>(
    data: HttpRequest<Body>,
  ): Promise<Result<HttpResponse<Response>, string, HttpResponse<Response>>> {
    try {
      const client = new HttpService(axios);

      const response = await client.axiosRef.request<Response>({
        url: data.url,
        method: data.method,
        params: data.params,
        data: data.body,
        headers: data.headers,
      });

      return Result.Ok({
        statusCode: response.status,
        response: {
          ...response.data,
        },
      });
    } catch (error) {
      return Result.fail(
        error.response.data || 'Houve um erro ao fazer a requisição',
        {
          statusCode: error.response.data.statusCode,
          response: {
            ...error.response.data,
          },
        },
      );
    }
  }

  public async requestExternalModule<Body = any, Response = any>(
    data: HttpRequestExternalModule<Body>,
  ): Promise<Result<HttpResponse<Response>, string, HttpResponse<Response>>> {
    try {
      const client = new HttpService(axios);

      const modulesKey = {
        spin: services.spinAppKey,
        acquiring: services.acquiringAppKey,
        waiver: services.waiverAppKey,
        apollo: services.apolloAppKey,
        sputnik: services.sputnikAppKey,
      };

      const response = await client.axiosRef.request<Response>({
        url: data.url,
        method: data.method,
        params: data.params,
        data: data.body,
        headers: {
          ...data.headers,
          'Subscription-Key': modulesKey[data.module],
          Origin: server.origin,
          IntegrationId: data.integrationId || '',
        },
      });

      return Result.Ok({
        statusCode: response.status,
        response: {
          ...response.data,
        },
      });
    } catch (error) {
      return Result.fail(
        error.response.data || 'Houve um erro ao fazer a requisição',
        {
          statusCode: error.response.status,
          response: {
            ...error.response.data,
          },
        },
      );
    }
  }
}
