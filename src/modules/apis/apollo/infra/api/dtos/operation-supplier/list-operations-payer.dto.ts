import { PaginationRequest } from '@shared/types';

export type ApolloListOperationsPayerDTORequest = PaginationRequest & {
  userId: string;
  supplierDocument?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  status?: string;
};
