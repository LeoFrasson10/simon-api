import {
  AdapterUserDBOToDomain,
  CreateUserOutput,
  IUserRepository,
  ListUsersInputFilters,
  ListUsersOutput,
  User,
} from '@modules/user/domain';

import { PrismaService } from '@shared/infra/db';

import { Result } from 'types-ddd';

import { Prisma } from '@prisma/client';

export class UserRepository implements IUserRepository {
  constructor(private readonly orm: PrismaService) {}

  public async findUserByEmail(email: string): Promise<Result<User>> {
    try {
      const dbo = await this.orm.user.findFirst({
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (dbo === null) return Result.fail('Usuário não encontrado');

      const adapter = new AdapterUserDBOToDomain();

      const adapted = adapter.build({
        id: dbo.id,
        active: dbo.active,
        document: dbo.document,
        name: dbo.name,
        email: dbo.email,
        password: dbo.password,
        isAdmin: dbo.is_admin,
        phone: dbo.phone,
        first_access: dbo.first_access,
        created_at: dbo.created_at,
        updated_at: dbo.updated_at,
        permission: dbo.permission,
        organization: dbo.organization,
      });

      return Result.Ok(adapted.value());
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  public async findUserById(userId: string): Promise<Result<User>> {
    try {
      const dbo = await this.orm.user.findFirst({
        where: {
          id: {
            in: [userId],
          },
        },
      });

      if (dbo === null) return Result.fail('Usuário não encontrado');

      const adapter = new AdapterUserDBOToDomain();

      const adapted = adapter.build({
        id: dbo.id,
        active: dbo.active,
        document: dbo.document,
        name: dbo.name,
        email: dbo.email,
        password: dbo.password,
        isAdmin: dbo.is_admin,
        created_at: dbo.created_at,
        first_access: dbo.first_access,
        updated_at: dbo.updated_at,
        permission: dbo.permission,
        organization: dbo.organization,
      });

      return Result.Ok(adapted.value());
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  public async listUsers(
    filters: ListUsersInputFilters,
  ): Promise<Result<ListUsersOutput>> {
    try {
      const { page, pageSize, active, document, name } = filters;

      const where: Prisma.userWhereInput = {
        ...(document
          ? {
              document: {
                equals: document,
              },
            }
          : {}),
        ...(name
          ? {
              name: {
                equals: name,
              },
            }
          : {}),
        ...(active
          ? {
              active: {
                equals: active === 'true' ? true : false,
              },
            }
          : {}),
      };

      const dbos = await this.orm.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          created_at: 'desc',
        },
      });

      const countUser = await this.orm.user.count({ where });

      const adapter = new AdapterUserDBOToDomain();
      const data: User[] = [];
      for (const dbo of dbos) {
        const adapted = adapter.build({
          id: dbo.id,
          active: dbo.active,
          document: dbo.document,
          name: dbo.name,
          email: dbo.email,
          isAdmin: dbo.is_admin,
          first_access: dbo.first_access,
          phone: dbo.phone,
          password: dbo.password,
          created_at: dbo.created_at,
          updated_at: dbo.updated_at,
          permission: dbo.permission,
          organization: dbo.organization,
        });

        data.push(adapted.value());
      }

      return Result.Ok({
        data,
        totalRecords: countUser,
      });
    } catch (error) {
      return Result.fail(`Ocorreu um erro na consulta: ${error.message}`);
    }
  }

  public async createUser(data: User): Promise<Result<CreateUserOutput>> {
    try {
      const user = await this.orm.user.create({
        data: {
          email: data.get('email'),
          name: data.get('name'),
          password: data.get('password'),
          document: data.get('document'),
          active: data.get('active'),
          is_admin: data.get('isAdmin'),
          phone: data.get('phone'),
          id: data.id.value(),
          permission: data.get('permission'),
          organization: data.get('organization'),
        },
      });

      return Result.Ok({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  public async update(data: User): Promise<Result<void>> {
    try {
      await this.orm.user.update({
        where: {
          id: data.id.value(),
        },
        data: {
          email: data.get('email'),
          name: data.get('name'),
          password: data.get('password'),
          permission: data.get('permission'),
          active: data.get('active'),
          first_access: data.get('firstAccess'),
          organization: data.get('organization'),
        },
      });

      return Result.Ok();
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}
