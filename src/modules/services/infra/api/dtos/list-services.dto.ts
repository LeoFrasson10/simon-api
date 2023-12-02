import { PaginationRequest } from '@shared/types';

export type ListServicesDTORequest = PaginationRequest & {
  name?: string;
  keys?: string[];
};
