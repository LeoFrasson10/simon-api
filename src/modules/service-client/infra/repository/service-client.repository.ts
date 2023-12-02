import { PrismaService } from '@shared/infra/db';

import { Result } from 'types-ddd';
import {
  AdapterServiceClientDBOToDomain,
  IServiceClientRepository,
  ServiceClient,
} from '@modules/service-client/domain';
import { DefaultCreateActionOutput } from '@shared/types';

export class ServiceClientRepository implements IServiceClientRepository {
  constructor(private readonly orm: PrismaService) {}

  async findServiceClientById(id: string): Promise<Result<ServiceClient>> {
    try {
      const dbo = await this.orm.service_client.findFirst({
        where: {
          id: {
            in: [id],
          },
        },
      });

      if (dbo === null) return Result.fail('Registro não encontrado.');

      const adapter = new AdapterServiceClientDBOToDomain();

      const adapted = adapter.build({
        id: dbo.id,
        client_id: dbo.client_id,
        modules_keys: dbo.modules_keys,
        created_at: new Date(dbo.created_at),
        updated_at: new Date(dbo.updated_at),
      });

      return Result.Ok(adapted.value());
    } catch (error) {
      return Result.fail(error);
    }
  }

  async createServiceClient(
    data: ServiceClient,
  ): Promise<Result<DefaultCreateActionOutput>> {
    try {
      const serviceDBO = await this.orm.service_client.create({
        data: {
          client_id: data.get('clientId').value(),
          modules_keys: data.get('keys'),
        },
      });

      return Result.Ok({
        id: serviceDBO.id,
      });
    } catch (error) {
      return Result.fail(error);
    }
  }
}
