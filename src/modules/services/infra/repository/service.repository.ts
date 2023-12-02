import { PrismaService } from '@shared/infra/db';

import { Result } from 'types-ddd';
import {
  AdapterServiceDBOToDomain,
  IServiceRepository,
  ListServicesInputFilters,
  ListServicesOutput,
  ListServicesStandardOutput,
  Service,
} from '@modules/services/domain';
import { Prisma } from '@prisma/client';
import { DefaultCreateActionOutput } from '@shared/types';

export class ServiceRepository implements IServiceRepository {
  constructor(private readonly orm: PrismaService) {}

  public async getAllServices(
    filters: ListServicesInputFilters,
  ): Promise<Result<ListServicesOutput>> {
    try {
      const { page, pageSize, keys, name } = filters;

      const where: Prisma.serviceWhereInput = {
        ...(keys
          ? {
              key: {
                in: keys,
              },
            }
          : {}),
        ...(name
          ? {
              name: {
                contains: name,
              },
            }
          : {}),
      };

      const dbos = await this.orm.service.findMany({
        ...(page
          ? {
              skip: (page - 1) * pageSize,
            }
          : {}),
        ...(pageSize
          ? {
              take: pageSize,
            }
          : {}),
        where,
        orderBy: {
          standard: 'desc',
        },
      });

      const countService = await this.orm.service.count({
        where,
      });

      const adapter = new AdapterServiceDBOToDomain();
      const data: Service[] = [];

      for (const dbo of dbos) {
        const adapted = adapter.build({
          id: dbo.id,
          active: dbo.active,
          key: dbo.key,
          name: dbo.name,
          standard: dbo.standard,
          label: dbo.label,
          created_at: new Date(dbo.created_at),
          updated_at: new Date(dbo.updated_at),
        });

        data.push(adapted.value());
      }

      return Result.Ok({
        data,
        totalRecords: countService,
      });
    } catch (error) {
      return Result.fail(`Ocorreu um erro na consulta: ${error.message}`);
    }
  }

  public async findServiceById(serviceId: string): Promise<Result<Service>> {
    try {
      const dbo = await this.orm.service.findFirst({
        where: {
          id: {
            in: [serviceId],
          },
        },
      });

      if (dbo === null) return Result.fail('Integração não encontrada');

      const adapter = new AdapterServiceDBOToDomain();

      const adapted = adapter.build({
        id: dbo.id,
        active: dbo.active,
        key: dbo.key,
        name: dbo.name,
        standard: dbo.standard,
        label: dbo.label,
        created_at: new Date(dbo.created_at),
        updated_at: new Date(dbo.updated_at),
      });

      return Result.Ok(adapted.value());
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async createService(
    data: Service,
  ): Promise<Result<DefaultCreateActionOutput>> {
    try {
      const serviceDBO = await this.orm.service.create({
        data: {
          id: data.id.value(),
          name: data.get('name'),
          active: data.get('active'),
          key: data.get('key'),
          standard: data.get('standard'),
          created_at: data.get('createdAt'),
          updated_at: data.get('updatedAt'),
          label: data.get('label'),
        },
      });

      return Result.Ok({
        id: serviceDBO.id,
      });
    } catch (error) {
      return Result.fail(error);
    }
  }

  async getStandarServices(): Promise<Result<ListServicesStandardOutput>> {
    try {
      const where: Prisma.serviceWhereInput = {
        standard: true,
        AND: {
          active: true,
        },
      };

      const dbos = await this.orm.service.findMany({
        where,
      });

      const count = await this.orm.service.count({ where });

      const adapter = new AdapterServiceDBOToDomain();
      const data: Service[] = [];

      for (const dbo of dbos) {
        const adapted = adapter.build({
          id: dbo.id,
          active: dbo.active,
          key: dbo.key,
          name: dbo.name,
          standard: dbo.standard,
          label: dbo.label,
          created_at: new Date(dbo.created_at),
          updated_at: new Date(dbo.updated_at),
        });

        data.push(adapted.value());
      }

      return Result.Ok({
        data,
        totalRecords: count,
      });
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async getServicesByKeys(keys: string[]): Promise<Result<Service[]>> {
    try {
      const dbos = await this.orm.service.findMany({
        where: {
          key: {
            in: keys,
          },
        },
      });

      const adapter = new AdapterServiceDBOToDomain();
      const data: Service[] = [];

      for (const dbo of dbos) {
        const adapted = adapter.build({
          id: dbo.id,
          active: dbo.active,
          key: dbo.key,
          name: dbo.name,
          standard: dbo.standard,
          label: dbo.label,
          created_at: new Date(dbo.created_at),
          updated_at: new Date(dbo.updated_at),
        });

        data.push(adapted.value());
      }

      return Result.Ok(data);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
