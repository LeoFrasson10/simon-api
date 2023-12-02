import {
  AdapterEconomicGroupDBOToDomain,
  EconomicGroup,
  IEconomicGroupRepository,
  ListEconomicGroupsInputFilters,
  ListEconomicGroupsOutput,
} from '@modules/economic-group/domain';

import { PrismaService } from '@shared/infra/db';

import { Result } from 'types-ddd';
import { Prisma } from '@prisma/client';
import { DefaultCreateActionOutput } from '@shared/types';

export class EconomicGroupRepository implements IEconomicGroupRepository {
  constructor(private readonly orm: PrismaService) {}

  public async listEconomicGroups(
    filters: ListEconomicGroupsInputFilters,
  ): Promise<Result<ListEconomicGroupsOutput>> {
    const { page, pageSize, active, name } = filters;

    const where: Prisma.economic_groupWhereInput = {
      ...(name
        ? {
            name: {
              contains: name,
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

    const dbos = await this.orm.economic_group.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        economicGroupContact: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    const adapter = new AdapterEconomicGroupDBOToDomain();
    const data: EconomicGroup[] = [];
    for (const dbo of dbos) {
      const adapted = adapter.build({
        active: dbo.active,
        name: dbo.name,
        id: dbo.id,
        created_at: dbo.created_at,
        note: dbo.note,
        updated_at: dbo.updated_at,
        contacts: dbo.economicGroupContact.map((ecc) => ({
          email: ecc.email,
          name: ecc.name,
          position: ecc.position,
          primary_phone: ecc.primary_phone,
          id: ecc.id,
          created_at: ecc.created_at,
          note: ecc.note,
          secondary_phone: ecc.secondary_phone,
          updated_at: ecc.updated_at,
        })),
      });

      if (adapted.isFail()) {
        return Result.fail(`${adapted.error()}: ${dbo.name}`);
      }

      data.push(adapted.value());
    }
    const count = await this.orm.economic_group.count({ where });

    return Result.Ok({
      data,
      totalRecords: count,
    });
  }

  public async createEconomicGroup(
    data: EconomicGroup,
  ): Promise<Result<DefaultCreateActionOutput>> {
    try {
      const economicGroupDBO = await this.orm.economic_group.create({
        data: {
          active: data.get('active'),
          name: data.get('name'),
          note: data.get('note') || null,
          economicGroupContact: {
            createMany: {
              data: data.get('contacts').map((c) => ({
                name: c.value().get('name'),
                primary_phone: c.value().get('primaryPhone'),
                secondary_phone: c.value().get('secondaryPhone') || null,
                email: c.value().get('email'),
                position: c.value().get('position'),
              })),
            },
          },
        },
      });

      return Result.Ok({
        id: economicGroupDBO.id,
      });
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async findEconomicGroupById(
    economicGroupId: string,
  ): Promise<Result<EconomicGroup>> {
    try {
      const dbo = await this.orm.economic_group.findFirst({
        where: {
          id: {
            in: [economicGroupId],
          },
        },
        include: {
          economicGroupContact: true,
          clients: true,
        },
      });

      if (dbo === null) return Result.fail('Grupo econômico não encontrado');

      const adapter = new AdapterEconomicGroupDBOToDomain();

      const adapted = adapter.build({
        active: dbo.active,
        name: dbo.name,
        id: dbo.id,
        created_at: dbo.created_at,
        note: dbo.note,
        updated_at: dbo.updated_at,
        contacts: dbo.economicGroupContact.map((ecc) => ({
          email: ecc.email,
          name: ecc.name,
          position: ecc.position,
          primary_phone: ecc.primary_phone,
          id: ecc.id,
          created_at: ecc.created_at,
          note: ecc.note,
          secondary_phone: ecc.secondary_phone,
          updated_at: ecc.updated_at,
        })),
        clients: dbo.clients
          ? dbo.clients.map((c) => ({
              ...c,
              monthly_invoicing: Number(c.monthly_invoicing),
            }))
          : null,
      });

      return Result.Ok(adapted.value());
    } catch (error) {
      return Result.fail(error);
    }
  }
}
