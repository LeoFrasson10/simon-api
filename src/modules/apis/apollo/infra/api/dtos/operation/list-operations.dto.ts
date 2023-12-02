import { PaginationRequest } from './shared.dto';

export type ApolloListOperationsDTORequest = PaginationRequest & {
  createdAtStart?: string;
  createdAtEnd?: string;
  payerDocument?: string;
  amountStart?: string;
  amountEnd?: string;
  status?: string;
};
