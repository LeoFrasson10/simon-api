import { PaginationUseCaseInput, PaginationUseCaseOutput } from '@shared/types';

export type ListEconomicGroupUseCaseDTOInput = PaginationUseCaseInput<{
  name?: string;
  active?: string;
}>;

export type ListEconomicGroupUseCaseDTOOutput =
  PaginationUseCaseOutput<EconomicGroupListItem>;

type EconomicGroupListItem = {
  id: string;
  name: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};
