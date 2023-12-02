import { lois } from '@shared/config';
import { IHttpClient } from '@shared/providers/http';
import { Result } from 'types-ddd';

import {
  AuthResponse,
  AuthResquest,
  CreateClientDTORequest,
  CreateClientDTOResponse,
  CreateClientsDTORequest,
  CreateClientsDTOResponse,
  GetBalancesDTOParams,
  GetBalancesDTOResponse,
  GetClientsDTOParams,
  GetClientsDTOResponse,
  UpdateBalancesDTORequest,
  UpdateBalancesDTOResponse,
} from './dtos';
import { ILois } from '../model';

export class Lois implements ILois {
  private readonly baseUrl = lois.baseUrl;
  private readonly subscriptionKey = lois.subscriptionKey;

  constructor(private readonly httpClient: IHttpClient) {}

  private async authenticate(): Promise<Result<string>> {
    const login = await this.httpClient.request<AuthResquest, AuthResponse>({
      method: 'post',
      url: `${this.baseUrl}/user/session`,
      // headers: {
      //   'Subscription-Key': this.subscriptionKey,
      // },
      body: {
        email: lois.authEmail,
        password: lois.authPassword,
      },
    });

    if (login.isFail()) return Result.fail(login.error());

    const { token } = login.value().response;

    return Result.Ok(token.token);
  }

  public async getBalances(
    params?: GetBalancesDTOParams,
  ): Promise<Result<GetBalancesDTOResponse>> {
    const token = await this.authenticate();

    if (token.isFail()) return Result.fail(token.error());

    const response = await this.httpClient.request<any, GetBalancesDTOResponse>(
      {
        method: 'get',
        url: `${this.baseUrl}/balances`,
        params: {
          documents: params.documents,
        },
        headers: {
          // 'Subscription-Key': this.subscriptionKey,
          Authorization: `Bearer ${token.value()}`,
        },
      },
    );

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(Object.values(response.value().response));
  }

  public async updateBalances(
    data: UpdateBalancesDTORequest,
  ): Promise<Result<UpdateBalancesDTOResponse>> {
    const token = await this.authenticate();

    if (token.isFail()) return Result.fail(token.error());

    const response = await this.httpClient.request<
      UpdateBalancesDTORequest,
      UpdateBalancesDTOResponse
    >({
      method: 'post',
      url: `${this.baseUrl}/balances/new`,
      body: {
        documents: data.documents,
      },
      headers: {
        // 'Subscription-Key': this.subscriptionKey,
        Authorization: `Bearer ${token.value()}`,
      },
    });

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(response.value().response);
  }

  public async getClients(
    filters?: GetClientsDTOParams,
  ): Promise<Result<GetClientsDTOResponse>> {
    const token = await this.authenticate();

    if (token.isFail()) return Result.fail(token.error());

    const response = await this.httpClient.request<any, GetClientsDTOResponse>({
      method: 'get',
      url: `${this.baseUrl}/client`,
      params: {
        document: filters.document ?? '',
      },
      headers: {
        // 'Subscription-Key': this.subscriptionKey,
        Authorization: `Bearer ${token.value()}`,
      },
    });

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(response.value().response);
  }

  public async createClients(
    data: CreateClientsDTORequest,
  ): Promise<Result<CreateClientsDTOResponse>> {
    const token = await this.authenticate();

    if (token.isFail()) return Result.fail(token.error());

    const response = await this.httpClient.request<
      CreateClientsDTORequest,
      CreateClientsDTOResponse
    >({
      method: 'post',
      url: `${this.baseUrl}/client/many`,
      body: {
        clients: data.clients,
      },
      headers: {
        // 'Subscription-Key': this.subscriptionKey,
        Authorization: `Bearer ${token.value()}`,
      },
    });

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(response.value().response);
  }

  public async createClient(
    data: CreateClientDTORequest,
  ): Promise<Result<CreateClientDTOResponse>> {
    const token = await this.authenticate();

    if (token.isFail()) return Result.fail(token.error());

    const response = await this.httpClient.request<
      CreateClientDTORequest,
      CreateClientDTOResponse
    >({
      method: 'post',
      url: `${this.baseUrl}/client`,
      body: data,
      headers: {
        // 'Subscription-Key': this.subscriptionKey,
        Authorization: `Bearer ${token.value()}`,
      },
    });

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(response.value().response);
  }
}
