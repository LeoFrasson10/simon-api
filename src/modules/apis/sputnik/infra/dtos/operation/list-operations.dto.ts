import { PaginationRequest } from './shared.dto';

export type SputnikListOperationsDTORequest = PaginationRequest & {
  payerDocument?: string;
  amountStart?: string;
  amountEnd?: string;
  status?: string;
};
