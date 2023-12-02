import { Result } from 'types-ddd';
import { Service } from '../aggregates';
import {
  DefaultCreateActionOutput,
  DefaultPaginationPropsOutput,
} from '@shared/types';

export type ListServicesInputFilters = {
  page?: number;
  pageSize?: number;
  keys?: string[];
  name?: string;
};

export type ListServicesOutput = DefaultPaginationPropsOutput<Service[]>;

export type ListServicesStandardOutput = DefaultPaginationPropsOutput<
  Service[]
>;

export interface IServiceRepository {
  findServiceById(serviceId: string): Promise<Result<Service>>;
  createService(data: Service): Promise<Result<DefaultCreateActionOutput>>;

  getAllServices(
    params: ListServicesInputFilters,
  ): Promise<Result<ListServicesOutput>>;
  getStandarServices(): Promise<Result<ListServicesStandardOutput>>;
  getServicesByKeys(keys: string[]): Promise<Result<Service[]>>;
  // createServiceToClient(data: CreateServiceToClientDTO): Promise<Result<any>>;
}
