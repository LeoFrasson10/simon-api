import { SetMetadata } from '@nestjs/common';
import { Permission } from '@shared/utils';

export const PERMISSIONS_KEY = 'roles';
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
