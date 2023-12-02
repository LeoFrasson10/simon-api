import { PaginationRequest } from '@shared/types';

export type ListClientsDTORequest = PaginationRequest & {
  name?: string;
  document?: string;
  onlyAcquiring?: boolean;
  approvedDateStart?: string;
  approvedDateEnd?: string;
};
