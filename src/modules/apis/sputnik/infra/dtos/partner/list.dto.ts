import { PaginationRequest } from '@shared/types';

export type SputnikListPartnersRequest = PaginationRequest & {
  name?: string;
};
