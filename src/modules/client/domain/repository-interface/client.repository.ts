import { Client, ClientAccountPlan } from '@modules/client/domain';
import { Result } from 'types-ddd';
import {
  DefaultCreateActionOutput,
  DefaultPaginationPropsInput,
  DefaultPaginationPropsOutput,
} from '@shared/types';

export type ListClientsInputFilters = DefaultPaginationPropsInput & {
  name?: string;
  document?: string;
  onlyAcquiring?: boolean;
  nameOrDocument?: string;
  approvedDateStart?: Date;
  approvedDateEnd?: Date;
  integrationId?: string;
};

export type ListClientsOutput = DefaultPaginationPropsOutput<Client[]>;

export type CreateClientOutput = DefaultCreateActionOutput & {
  name: string;
  document: string;
  monthlyInvoicing: number;
  integrationId: string;
  email: string;
  phone: string;
  serviceClient?: {
    id: string;
    modulesKeys: string[];
  };
};

export interface IClientRepository {
  findClientById(clientId: string): Promise<Result<Client>>;
  findClientByDocument(document: string): Promise<Result<Client>>;
  findClientByDocumentAndIntegration(
    document: string,
    integrationId: string,
  ): Promise<Result<Client>>;
  findClientByBaaSId(baasId: string): Promise<Result<Client>>;
  findClientByEstablishmentId(establishmentId: string): Promise<Result<Client>>;
  createClient(
    data: Client,
    standardServices: string[],
  ): Promise<Result<CreateClientOutput>>;
  listClients(
    filters: ListClientsInputFilters,
  ): Promise<Result<ListClientsOutput>>;
  listClientsWithBaaSId(): Promise<Result<ListClientsOutput>>;
  update(
    data: Client,
    standardServices: string[],
  ): Promise<Result<DefaultCreateActionOutput>>;

  changeClientApprovedDate(
    data: Client,
  ): Promise<Result<DefaultCreateActionOutput>>;

  findClientsByEconomicGroup(
    economicGroupId: string,
  ): Promise<Result<Client[]>>;

  createByIntegration(
    data: Client,
    standardServices: string[],
  ): Promise<Result<CreateClientOutput>>;

  createClientAccountPlan(
    data: ClientAccountPlan,
  ): Promise<Result<DefaultCreateActionOutput>>;
}
