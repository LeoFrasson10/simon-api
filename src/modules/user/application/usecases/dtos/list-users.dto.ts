import { PermissionType } from '@modules/user/domain';
import { PaginationUseCaseInput, PaginationUseCaseOutput } from '@shared/types';
import { OrganizationEnum } from '@shared/utils';

export type ListUsersUseCaseDTOInput = PaginationUseCaseInput<{
  name?: string;
  document?: string;
  active?: string;
}>;

export type ListUsersUseCaseDTOOutput = PaginationUseCaseOutput<UsersListItem>;

type UsersListItem = {
  id: string;
  name: string;
  email: string;
  document: string;
  active: boolean;
  isAdmin: boolean;
  phone: string;
  createdAt: Date;
  organization: OrganizationEnum;
  permission: PermissionType;
};
