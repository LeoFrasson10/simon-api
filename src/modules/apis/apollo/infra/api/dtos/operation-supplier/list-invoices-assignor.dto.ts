import { PaginationRequest, PaginationUseCaseOutput } from '@shared/types';

export type ApolloListOperationSupplierInvoicesAssignorDTORequest =
  PaginationRequest & {
    supplierId?: string;
    createdAtStart?: string;
    createdAtEnd?: string;
    amountStart?: string;
    amountEnd?: string;
    status?: string;
  };

export type ApolloListOperationSupplierInvoicesAssignorDTOResponse =
  PaginationUseCaseOutput<InvoicesListItem>;

type InvoicesListItem = {
  id: string;

  status: string;

  payerDocument: string;
  corporateName: string;
  cfop: string;
  number: string;
  amount: number;
  invoiceType: string;
  emissionDate: Date;
  dueDate: Date;
  approvedAt?: Date;
  approvedBy?: string;
  refusedAt?: Date;
  refusedBy?: string;

  createdAt: Date;
  fixes?: InvoiceFixes[];
};

type InvoiceFixes = {
  id: string;
  dueDate: Date;
  amount: number;
  createdAt: Date;
};
