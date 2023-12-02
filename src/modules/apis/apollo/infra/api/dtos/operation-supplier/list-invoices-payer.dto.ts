import { PaginationRequest } from '@shared/types';

export type ApolloListOperationSupplierInvoicesPayerDTORequest =
  PaginationRequest & {
    supplierDocument?: string;
    invoiceNumber?: string;
    confirmationDateStart?: string;
    confirmationDateEnd?: string;
    status?: string;
  };
