import { PaginationRequest } from '@shared/types';

export type SputnikListClientsRequest = PaginationRequest & {
  name?: string;
};
