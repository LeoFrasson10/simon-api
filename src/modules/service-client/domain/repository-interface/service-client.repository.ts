import { Result } from 'types-ddd';
import { ServiceClient } from '../aggregates';
import { DefaultCreateActionOutput } from '@shared/types';

export interface IServiceClientRepository {
  findServiceClientById(id: string): Promise<Result<ServiceClient>>;
  createServiceClient(
    data: ServiceClient,
  ): Promise<Result<DefaultCreateActionOutput>>;
}
