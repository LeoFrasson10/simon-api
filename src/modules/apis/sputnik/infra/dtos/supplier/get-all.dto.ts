import { PaginationRequest } from '@shared/types';

export type SputnikListSuppliersDTORequest = PaginationRequest & {
  document?: string;
  assignorId?: string;
  partnerId?: string;
};
