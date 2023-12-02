import { PaginationRequest } from '@shared/types';

export type ListApolloSuppliersDTORequest = PaginationRequest & {
  document?: string;
  assignorId?: string;
  partnerId?: string;
};
