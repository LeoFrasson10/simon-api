import { modal } from '@shared/config';
import { IHttpClient } from '@shared/providers/http';
import { Result } from 'types-ddd';
import { IBaaS } from '../model';
import {
  AccountCompanyResponse,
  AuthResponse,
  AuthResquest,
  BaaSPlansOutput,
  BaaSPlansResponse,
  ChangePlanAccountInputRequest,
  ChangePlanAccountResponse,
  CompanyByDocumentResponse,
  CompanyModal,
  CompanyModalResponse,
  IndividualByDocumentResponse,
  IndividualModalResponse,
} from './dtos';
import { IIntegrationRepository } from '@modules/integrations';
import { ICryptoProvider } from '@shared/providers/encrypt';
import { BaaSRequestDTO, MongooseBaaSRequest } from '../infra';

type Auth = {
  url: string;
  email?: string;
  password?: string;
  key?: string;
  token?: string;
};

export class BaaS implements IBaaS {
  private readonly baseUrl = modal.baseUrl;
  private readonly subscriptionKey = modal.subscriptionKey;

  constructor(
    private readonly httpClient: IHttpClient,
    private readonly integrationRepository: IIntegrationRepository,
    private readonly encryptation: ICryptoProvider,
  ) { }
  private async saveToken(
    token: string,
    origin: string,
  ): Promise<Result<void>> {
    try {
      const mongoBaasRequestInstance = MongooseBaaSRequest.getInstance();
      const baasModel = mongoBaasRequestInstance.getModel('baas-request');

      const maxLifetime = Number(modal.tokenMaxLifetimeInMinutes);

      const expirationDate = new Date(Date.now() + maxLifetime * 60 * 1000);

      await baasModel.create({
        token,
        origin,
        duedate: expirationDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return Result.Ok();
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  private async getCredentialsByIntegration(
    integrationId: string,
  ): Promise<Result<Auth>> {
    const integration = await this.integrationRepository.findIntegrationById(
      integrationId,
    );

    if (integration.isFail()) {
      return Result.fail(integration.error());
    }

    const integrationInstance = integration.value();
    const credentials = await integrationInstance.getCredentials();

    if (!credentials || credentials.isFail()) {
      return Result.fail(credentials.error());
    }

    const credentialsInstance = credentials.value();

    return Result.Ok({
      email: credentialsInstance.baas.user.email,
      password: credentialsInstance.baas.user.password,
      key: credentialsInstance.baas.key,
      url: credentialsInstance.baas.url,
    });
  }

  private async authenticate(integrationId?: string): Promise<Result<Auth>> {
    let email = modal.authEmail;
    let password = modal.authPassword;
    let key = this.subscriptionKey;
    let baseUrl = this.baseUrl;
    let token = null;

    if (integrationId) {
      const credentials = await this.getCredentialsByIntegration(integrationId);

      if (credentials.isFail()) {
        return Result.fail(credentials.error());
      }

      const credentialsValue = credentials.value();

      email = credentialsValue.email;
      key = credentialsValue.key;
      password = credentialsValue.password;
      baseUrl = credentialsValue.url;
    }

    const mongoBaasRequestInstance = MongooseBaaSRequest.getInstance();
    const baasModel = mongoBaasRequestInstance.getModel('baas-request');

    const req: BaaSRequestDTO = await baasModel
      .findOne({
        origin: baseUrl,
      })
      .sort({ createdAt: -1 })
      .exec();

    if (req) {
      const dueDateFromDatabase = new Date(req.duedate);
      const expirationThreshold = new Date(dueDateFromDatabase);
      expirationThreshold.setMinutes(expirationThreshold.getMinutes() - 5);

      const currentDate = new Date();

      if (currentDate < expirationThreshold) {
        token = req.token;
      } else {
        const login = await this.httpClient.request<AuthResquest, AuthResponse>(
          {
            method: 'post',
            url: `${baseUrl}/admin/auth`,
            headers: {
              'Subscription-Key': key,
            },
            body: {
              email,
              password,
            },
          },
        );

        if (login.isFail()) return Result.fail(login.error());
        token = login.value().response.token;

        await this.saveToken(token, baseUrl);
      }
    } else {
      const login = await this.httpClient.request<AuthResquest, AuthResponse>({
        method: 'post',
        url: `${baseUrl}/admin/auth`,
        headers: {
          'Subscription-Key': key,
        },
        body: {
          email,
          password,
        },
      });

      if (login.isFail()) return Result.fail(login.error());
      token = login.value().response.token;

      await this.saveToken(token, baseUrl);
    }

    return Result.Ok({
      token,
      url: baseUrl,
      key,
    });
  }

  public async getCompanyById(
    id: string,
    integrationId?: string,
  ): Promise<Result<CompanyModal>> {
    const baasAuth = await this.authenticate(integrationId);

    if (baasAuth.isFail()) return Result.fail(baasAuth.error());

    const baasAuthValue = baasAuth.value();

    const companyResponse = await this.httpClient.request<any, CompanyModal>({
      method: 'get',
      url: `${baasAuthValue.url}/portal/company/${id}`,
      headers: {
        'Subscription-Key': baasAuthValue.key,
        Authorization: `Bearer ${baasAuthValue.token}`,
      },
    });

    if (companyResponse.isFail()) return Result.fail(companyResponse.error());

    return Result.Ok(companyResponse.value().response);
  }

  async getIndividualById(baasId: string, integrationId?: string): Promise<Result<IndividualByDocumentResponse>> {
    const baasAuth = await this.authenticate(integrationId);
    if (baasAuth.isFail()) return Result.fail(baasAuth.error());

    const baasAuthValue = baasAuth.value();

    const individualResponse = await this.httpClient.request<any, IndividualByDocumentResponse>({
      method: 'get',
      url: `${baasAuthValue.url}/portal/individual/${baasId}`,
      headers: {
        'Subscription-Key': baasAuthValue.key,
        Authorization: `Bearer ${baasAuthValue.token}`,
      },
    });

    if (individualResponse.isFail()) return Result.fail(individualResponse.error());

    return Result.Ok(individualResponse.value().response);
  }

  public async getBaaSAccountById(
    accountId: string,
    integrationId?: string,
  ): Promise<Result<AccountCompanyResponse>> {
    const baasAuth = await this.authenticate(integrationId);

    if (baasAuth.isFail()) return Result.fail(baasAuth.error());

    const baasAuthValue = baasAuth.value();

    const response = await this.httpClient.request<any, AccountCompanyResponse>(
      {
        method: 'get',
        url: `${baasAuthValue.url}/portal/account/${accountId}`,
        headers: {
          'Subscription-Key': baasAuthValue.key,
          Authorization: `Bearer ${baasAuthValue.token}`,
        },
      },
    );

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(response.value().response);
  }

  public async requestCompanyByDocument(
    document: string,
    integrationId?: string,
  ): Promise<Result<CompanyByDocumentResponse>> {
    const baasAuth = await this.authenticate(integrationId);

    if (baasAuth.isFail()) return Result.fail(baasAuth.error());

    const baasAuthValue = baasAuth.value();

    if (!document) {
      return Result.fail('Documento não informado');
    }

    console.log({
      url: `${baasAuthValue.url}/portal/companies`,
      method: 'get',
      params: {
        search: document,
      },
      headers: {
        'Subscription-Key': baasAuthValue.key,
        Authorization: `Bearer ${baasAuthValue.token}`,
      },
    });

    const response = await this.httpClient.request<any, CompanyModalResponse>({
      url: `${baasAuthValue.url}/portal/companies`,
      method: 'get',
      params: {
        search: document,
      },
      headers: {
        'Subscription-Key': baasAuthValue.key,
        Authorization: `Bearer ${baasAuthValue.token}`,
      },
    });

    console.log({ response });

    if (response.isFail()) return Result.fail(response.error());

    const hasCompany = response.value().response.docs[0];

    if (!hasCompany) {
      return Result.fail('Empresa não encontrada');
    }

    if (hasCompany.documentNumber !== document) {
      return Result.fail('Empresa não encontrada');
    }

    const companyId = hasCompany.id;

    const company = await this.getCompanyById(companyId, integrationId);

    if (company.isFail()) return Result.fail(company.error());

    return Result.Ok({
      company: {
        ...company.value(),
        alias_account: company.value().externalAliasAccount
          ? company.value().externalAliasAccount
          : null,
      },
    });
  }

  public async searchCompany(
    search: string,
    integrationId?: string,
  ): Promise<Result<CompanyModalResponse>> {
    const baasAuth = await this.authenticate(integrationId);

    if (baasAuth.isFail()) return Result.fail(baasAuth.error());

    const baasAuthValue = baasAuth.value();

    if (!search) {
      return Result.fail('Nome ou Documento não informado');
    }

    const response = await this.httpClient.request<any, CompanyModalResponse>({
      url: `${baasAuthValue.url}/portal/companies`,
      method: 'get',
      params: {
        search,
      },
      headers: {
        'Subscription-Key': baasAuthValue.key,
        Authorization: `Bearer ${baasAuthValue.token}`,
      },
    });

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(response.value().response);
  }

  async requestIndividualByDocument(
    document: string,
    integrationId?: string
  ): Promise<Result<IndividualByDocumentResponse>> {
    const baasAuth = await this.authenticate(integrationId);
    if (baasAuth.isFail()) return Result.fail(baasAuth.error());

    const baasAuthValue = baasAuth.value();

    if (!document) {
      return Result.fail('Documento não informado');
    }

    const response = await this.httpClient.request<any, IndividualModalResponse>({
      url: `${baasAuthValue.url}/portal/individuals`,
      method: 'get',
      params: {
        search: document,
      },
      headers: {
        'Subscription-Key': baasAuthValue.key,
        Authorization: `Bearer ${baasAuthValue.token}`,
      },
    });

    if (response.isFail()) return Result.fail(response.error());

    const hasIndividual = response.value().response.docs[0];

    if (!hasIndividual) {
      return Result.fail('Individuo não encontrada');
    }

    if (hasIndividual.document.number !== document) {
      return Result.fail('Individuo não encontrada');
    }

    const individualId = hasIndividual.id;

    const individual = await this.getIndividualById(individualId, integrationId);

    if (individual.isFail()) return Result.fail(individual.error());

    let individualInstance = individual.value().individual;

    const accountId = individualInstance.accountId;

    if (accountId && accountId != '') {
      const account = await this.getBaaSAccountById(accountId, integrationId);
      if (account.isFail()) return Result.fail(account.error())

      individualInstance.aliasAccount = account.value().alias_account ?? null
    }

    return Result.Ok({
      individual: individualInstance
    });
  }

  public async listCompanies(
    page: number,
    limit: number,
    integrationId?: string,
  ): Promise<Result<CompanyModalResponse>> {
    const baasAuth = await this.authenticate(integrationId);

    if (baasAuth.isFail()) return Result.fail(baasAuth.error());

    const baasAuthValue = baasAuth.value();
    const response = await this.httpClient.request<any, CompanyModalResponse>({
      url: `${baasAuthValue.url}/portal/companies`,
      method: 'get',
      params: {
        page,
        limit,
      },
      headers: {
        'Subscription-Key': baasAuthValue.key,
        Authorization: `Bearer ${baasAuthValue.token}`,
      },
    });

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(response.value().response);
  }

  async listIndividual(page: number, limit: number, integrationId?: string): Promise<Result<IndividualModalResponse>> {
    const baasAuth = await this.authenticate(integrationId);
    if (baasAuth.isFail()) return Result.fail(baasAuth.error());

    const baasAuthValue = baasAuth.value();

    const response = await this.httpClient.request<any, IndividualModalResponse>({
      url: `${baasAuthValue.url}/portal/individuals`,
      method: 'get',
      params: {
        page,
        limit,
      },
      headers: {
        'Subscription-Key': baasAuthValue.key,
        Authorization: `Bearer ${baasAuthValue.token}`,
      },
    });
    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(response.value().response);
  }

  public async listPlans(
    integrationId?: string,
  ): Promise<Result<BaaSPlansOutput>> {
    const baasAuth = await this.authenticate(integrationId);

    if (baasAuth.isFail()) return Result.fail(baasAuth.error());

    const baasAuthValue = baasAuth.value();

    const response = await this.httpClient.request<any, BaaSPlansResponse>({
      url: `${baasAuthValue.url}/portal/plans`,
      method: 'get',
      headers: {
        'Subscription-Key': baasAuthValue.key,
        Authorization: `Bearer ${baasAuthValue.token}`,
      },
    });

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok({
      itens: response.value().response.itens.map((p) => ({
        ...p,
        monthly_payment: p.monthly_payment / 100,
      })),
    });
  }

  public async changePlanOfAccounts(
    data: ChangePlanAccountInputRequest,
    integrationId?: string,
  ): Promise<Result<ChangePlanAccountResponse>> {
    const baasAuth = await this.authenticate(integrationId);

    if (baasAuth.isFail()) return Result.fail(baasAuth.error());

    const baasAuthValue = baasAuth.value();

    const response = await this.httpClient.request<
      ChangePlanAccountInputRequest,
      ChangePlanAccountResponse
    >({
      url: `${baasAuthValue.url}/portal/plans/apply_many`,
      method: 'put',
      body: {
        debit: data.debit,
        documents: data.documents,
        service_plan_id: data.service_plan_id,
      },
      headers: {
        'Subscription-Key': baasAuthValue.key,
        Authorization: `Bearer ${baasAuthValue.token}`,
      },
    });

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(response.value().response);
  }
}
