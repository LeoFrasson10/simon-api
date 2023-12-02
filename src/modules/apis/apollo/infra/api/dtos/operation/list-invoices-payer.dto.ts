import { PaginationRequest } from './shared.dto';

export type ApolloListInvoicesPayerDTORequest = PaginationRequest & {
  assignorDocument?: string;
  payerDocument?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  amountStart?: string;
  amountEnd?: string;
  status?: string;
};
