import { PaginationRequest } from '@shared/types';

export type ApolloListSupplierPayerDTORequest = PaginationRequest & {
  userId: string;
  onlyAwaitingInvoices?: boolean;
};
