import { Result } from 'types-ddd';
import { EconomicGroup } from '../aggregates';
import {
  DefaultCreateActionOutput,
  DefaultPaginationPropsInput,
  DefaultPaginationPropsOutput,
} from '@shared/types';

export type ListEconomicGroupsInputFilters = DefaultPaginationPropsInput & {
  name?: string;
  active?: string;
};

export type ListEconomicGroupsOutput = DefaultPaginationPropsOutput<
  EconomicGroup[]
>;

export interface IEconomicGroupRepository {
  findEconomicGroupById(
    economicGroupId: string,
  ): Promise<Result<EconomicGroup>>;
  listEconomicGroups(
    filters: ListEconomicGroupsInputFilters,
  ): Promise<Result<ListEconomicGroupsOutput>>;

  createEconomicGroup(
    data: EconomicGroup,
  ): Promise<Result<DefaultCreateActionOutput>>;
}
