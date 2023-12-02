import { Permission } from '@shared/utils';

export type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  phone?: string;
  document: string;
  active?: boolean;
  permission?: Permission;
};
