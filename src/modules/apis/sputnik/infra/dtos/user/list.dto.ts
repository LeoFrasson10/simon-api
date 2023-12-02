import { PaginationRequest } from '@shared/types';

export type SputnikListUsersRequest = PaginationRequest & {
  name?: string;
};
