import { PaginationRequest } from './shared.dto';

export type SputnikListInvoicesPortalDTORequest = PaginationRequest & {
  partnerId?: string;
  assignorId?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  status?: string;
};
