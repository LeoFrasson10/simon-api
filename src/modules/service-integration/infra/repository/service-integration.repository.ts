import { PrismaService } from '@shared/infra/db';

import { Result } from 'types-ddd';
import { DefaultCreateActionOutput } from '@shared/types';
import {
  IServiceIntegrationRepository,
  ServiceIntegration,
} from '@modules/service-integration/domain';

export class ServiceIntegrationRepository
  implements IServiceIntegrationRepository
{
  constructor(private readonly orm: PrismaService) {}

  public async createServiceIntegration(
    data: ServiceIntegration,
  ): Promise<Result<DefaultCreateActionOutput>> {
    try {
      const serviceDBO = await this.orm.integration_service.create({
        data: {
          integration_id: data.get('integrationId').value(),
          service_ids: data.get('serviceIds'),
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
