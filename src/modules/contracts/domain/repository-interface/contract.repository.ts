import { Result } from 'types-ddd';
import {
  DefaultCreateActionOutput,
  DefaultPaginationPropsInput,
  DefaultPaginationPropsOutput,
} from '@shared/types';
import { Contract } from '../aggregates';

export type ListContractsInputFilters = DefaultPaginationPropsInput & {
  search?: string;
};

export type ListContractsOutput = DefaultPaginationPropsOutput<Contract[]>;

export interface IContractRepository {
  findById(contractId: string): Promise<Result<Contract>>;
  create(data: Contract): Promise<Result<DefaultCreateActionOutput>>;
  list(
    filters: ListContractsInputFilters,
  ): Promise<Result<ListContractsOutput>>;

  update(data: Contract): Promise<Result<DefaultCreateActionOutput>>;
}
