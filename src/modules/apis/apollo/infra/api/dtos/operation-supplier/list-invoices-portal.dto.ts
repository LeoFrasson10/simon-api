import { PaginationRequest } from '@shared/types';

export type ApolloListOperationSupplierInvoicesPortalDTORequest =
  PaginationRequest & {
    supplierDocument?: string;
    invoiceNumber?: string;
    confirmationDateStart?: string;
    confirmationDateEnd?: string;
    status?: string;
  };
