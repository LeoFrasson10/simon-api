import { PaginationRequest } from './shared.dto';

export type SputnikListOperationsPortalDTORequest = PaginationRequest & {
  partnerId?: string;
  assignorId?: string;
  status?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
};
