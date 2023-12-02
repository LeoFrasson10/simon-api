import { PaginationRequest } from '@shared/types';

export type ListClientsDTORequest = PaginationRequest & {
  name?: string;
};
