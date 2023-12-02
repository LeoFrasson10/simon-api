import { Result } from 'types-ddd';
import { Integration } from '../aggregates';
import {
  DefaultCreateActionOutput,
  DefaultPaginationPropsInput,
  DefaultPaginationPropsOutput,
} from '@shared/types';

export type RefreshTokenResponse = {
  token: string;
};

export type ListIntegrationsInputFilters = DefaultPaginationPropsInput & {
  name?: string;
};

export type ListIntegrationsOutput = DefaultPaginationPropsOutput<
  Integration[]
>;

export interface IIntegrationRepository {
  findIntegrationById(integrationId: string): Promise<Result<Integration>>;
  findIntegrationByEmail(email: string): Promise<Result<Integration>>;
  createIntegration(
    data: Integration,
  ): Promise<Result<DefaultCreateActionOutput>>;
  listIntegrations(
    filters: ListIntegrationsInputFilters,
  ): Promise<Result<ListIntegrationsOutput>>;
  // getIntegrationById(id: string): Promise<Result<IntegrationById>>;
  refreshToken(data: Integration): Promise<Result<void>>;
  updateIntegration(
    data: Integration,
    saveLog?: boolean,
  ): Promise<Result<DefaultCreateActionOutput>>;
  // getAllIntegrations(
  //   params: FindAllIntegrationsParams,
  // ): Promise<Result<FindAllIntegrationsResponse>>;
}
