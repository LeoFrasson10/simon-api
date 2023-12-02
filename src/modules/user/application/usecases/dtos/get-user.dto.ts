import { PermissionType } from '@modules/user/domain';

export type GetUserUseCaseDTOInput = {
  userId?: string;
  email?: string;
  password?: string;
};

export type GetUserUseCaseDTOOutput = {
  id: string;
  name: string;
  email: string;
  document: string;
  active: boolean;
  isAdmin: boolean;
  phone: string;
  createdAt: Date;
  permission: PermissionType;
};
