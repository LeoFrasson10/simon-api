import { PaginationRequest } from '@shared/types';

export type ApolloListOperationsPortalDTORequest = PaginationRequest & {
  partnerId?: string;
  supplierDocument?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  status?: string;
};
