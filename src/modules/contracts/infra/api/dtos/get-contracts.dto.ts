import { PaginationRequest } from '@shared/types';

export type ListContractsDTORequest = PaginationRequest & {
  search?: string;
};
