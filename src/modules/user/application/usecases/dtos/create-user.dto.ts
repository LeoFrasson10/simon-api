import { OrganizationEnum, Permission } from '@shared/utils';

export type CreateUserUseCaseDTOInput = {
  name: string;
  email: string;
  password: string;
  document: string;
  active?: boolean;
  isAdmin?: boolean;
  phone?: string;
  permission?: Permission;
  organization?: OrganizationEnum;
};

export type CreateUserUseCaseDTOOutput = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  temporaryPassword: string;
};
