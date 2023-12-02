import { IAdapter, Result, ID } from 'types-ddd';
import { PermissionType, User } from '@modules/user/domain';
import { UserDBO } from '@modules/user/infra';
import { OrganizationEnum } from '@shared/utils';

export class AdapterUserDBOToDomain implements IAdapter<UserDBO, User> {
  public build(data: UserDBO): Result<User> {
    const user = User.create({
      id: ID.create(data.id),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),

      name: data.name,
      email: data.email,
      document: data.document,
      isAdmin: data.isAdmin,
      password: data.password,
      phone: data.phone,
      active: data.active,
      firstAccess: data.first_access,
      permission: PermissionType[data.permission],
      organization: data.organization
        ? (data.organization as OrganizationEnum)
        : null,
    });

    if (user.isFail()) return Result.fail(user.error());

    return Result.Ok(user.value());
  }
}
