import { PaginationRequest } from '@shared/types';

export type ListEconomicGroupsDTORequest = PaginationRequest & {
  name?: string;
  active?: string;
};
