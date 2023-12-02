import { PaginationRequest } from './shared.dto';

export type SputnikListInvoicesSupplierDTORequest = PaginationRequest & {
  assignorDocument?: string;
  payerDocument?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  status?: string;
};
