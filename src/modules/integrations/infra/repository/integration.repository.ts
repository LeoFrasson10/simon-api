import {
  AdapterIntegrationDBOToDomain,
  IIntegrationRepository,
  Integration,
  ListIntegrationsInputFilters,
  ListIntegrationsOutput,
} from '@modules/integrations/domain';
import { PrismaService } from '@shared/infra/db';
import { IDateProvider, MakeDateProvider } from '@shared/providers';

import { Result } from 'types-ddd';

import { Prisma } from '@prisma/client';
import { DefaultCreateActionOutput } from '@shared/types';

export class IntegrationRepository implements IIntegrationRepository {
  private dateProvider: IDateProvider;
  constructor(private readonly orm: PrismaService) {
    this.dateProvider = MakeDateProvider.getProvider();
  }

  public async findIntegrationById(
    integrationId: string,
  ): Promise<Result<Integration>> {
    try {
      const dbo = await this.orm.integration.findFirst({
        where: {
          id: {
            in: [integrationId],
          },
        },
      });

      if (dbo === null) return Result.fail('Integração não encontrada');

      const adapter = new AdapterIntegrationDBOToDomain();

      const adapted = adapter.build({
        id: dbo.id,
        name: dbo.name,
        email: dbo.email,
        active: dbo.active,
        auto_approved: dbo.auto_approved,
        created_at: new Date(dbo.created_at),
        updated_at: new Date(dbo.updated_at),
        origin: dbo.origin,
        full_access: dbo.full_access,
        credentials: dbo.credentials,
      });

      return Result.Ok(adapted.value());
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async findIntegrationByEmail(
    email: string,
  ): Promise<Result<Integration>> {
    try {
      const dbo = await this.orm.integration.findFirst({
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (dbo === null) return Result.fail('Integração não encontrada');

      const adapter = new AdapterIntegrationDBOToDomain();

      const adapted = adapter.build({
        id: dbo.id,
        name: dbo.name,
        email: dbo.email,
        active: dbo.active,
        auto_approved: dbo.auto_approved,
        created_at: new Date(dbo.created_at),
        updated_at: new Date(dbo.updated_at),
      });

      return Result.Ok(adapted.value());
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async listIntegrations(
    filters: ListIntegrationsInputFilters,
  ): Promise<Result<ListIntegrationsOutput>> {
    try {
      const { page, pageSize, name } = filters;

      const where: Prisma.integrationWhereInput = {
        ...(name
          ? {
              name: {
                contains: name,
              },
            }
          : {}),
      };

      const dbos = await this.orm.integration.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: {
          integration_log: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          },
        },
      });

      const countIntegrations = await this.orm.integration.count({ where });

      const adapter = new AdapterIntegrationDBOToDomain();
      const data: Integration[] = [];

      for (const dbo of dbos) {
        const dueDate = dbo.integration_log[0]?.due_date;
        const adapted = adapter.build({
          id: dbo.id,
          name: dbo.name,
          email: dbo.email,
          active: dbo.active,
          auto_approved: dbo.auto_approved,
          due_date: dueDate ? new Date(dueDate) : null,
          created_at: new Date(dbo.created_at),
          updated_at: new Date(dbo.updated_at),
        });

        data.push(adapted.value());
      }

      return Result.Ok({
        data,
        totalRecords: countIntegrations,
      });
    } catch (error) {
      return Result.fail(`Ocorreu um erro na consulta: ${error.message}`);
    }
  }

  public async createIntegration(
    data: Integration,
  ): Promise<Result<DefaultCreateActionOutput>> {
    try {
      const dbo = await this.orm.$transaction(async (prisma) => {
        const integration = await prisma.integration.create({
          data: {
            id: data.id.value(),
            name: data.get('name'),
            active: data.get('active'),
            email: data.get('email'),
            auto_approved: data.get('autoApproved'),
            document: data.get('document'),
            origin: data.get('origin'),
            key: data.get('key'),
            credentials: data.get('credentials'),
            full_access: data.get('fullAccess'),
          },
        });

        await prisma.integration_log.create({
          data: {
            due_date: data.get('dueDate'),
            integration_id: integration.id,
            details: data.get('details'),
          },
        });

        return {
          integration,
        };
      });

      return Result.Ok({
        id: dbo.integration.id,
      });
    } catch (error) {
      return Result.fail('Erro ao inserir integração.');
    }
  }

  public async refreshToken(data: Integration): Promise<Result<void>> {
    try {
      await this.orm.integration_log.create({
        data: {
          due_date: data.get('dueDate'),
          integration_id: data.id.value(),
          details: data.get('details'),
        },
      });

      return Result.Ok();
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  public async updateIntegration(
    data: Integration,
    saveLog?: boolean,
  ): Promise<Result<DefaultCreateActionOutput>> {
    try {
      const dbo = await this.orm.$transaction(async (prisma) => {
        const integration = await prisma.integration.update({
          where: {
            id: data.id.value(),
          },
          data: {
            name: data.get('name'),
            active: data.get('active'),
            auto_approved: data.get('autoApproved'),
            origin: data.get('origin'),
            key: data.get('key'),
            credentials: data.get('credentials'),
            full_access: data.get('fullAccess') ?? true,
          },
        });
        if (saveLog) {
          await prisma.integration_log.create({
            data: {
              due_date: data.get('dueDate'),
              integration_id: integration.id,
              details: data.get('details'),
            },
          });
        }

        return {
          integration,
        };
      });

      return Result.Ok({
        id: dbo.integration.id,
      });
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}
