import { IAdapter, ID, Result } from 'types-ddd';
import { ServiceIntegration } from '../aggregates';
import { ServiceIntegrationDBO } from '@modules/service-integration/infra';

export class AdapterServiceIntegrationDBOToDomain
  implements IAdapter<ServiceIntegrationDBO, ServiceIntegration>
{
  public build(data: ServiceIntegrationDBO): Result<ServiceIntegration> {
    const serviceIntegration = ServiceIntegration.create({
      integrationId: ID.create(data.integration_id),
      serviceIds: data.service_ids,
    });

    if (serviceIntegration.isFail())
      return Result.fail(serviceIntegration.error());

    return Result.Ok(serviceIntegration.value());
  }
}
