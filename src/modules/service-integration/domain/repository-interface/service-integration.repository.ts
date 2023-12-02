import { Result } from 'types-ddd';
import { ServiceIntegration } from '../aggregates';
import { DefaultCreateActionOutput } from '@shared/types';

export interface IServiceIntegrationRepository {
  createServiceIntegration(
    data: ServiceIntegration,
  ): Promise<Result<DefaultCreateActionOutput>>;
}
