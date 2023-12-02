import { IAdapter, ID, Result } from 'types-ddd';
import { ServiceClient } from '@modules/service-client/domain';
import { ServiceClientDBO } from '@modules/service-client/infra';

export class AdapterServiceClientDBOToDomain
  implements IAdapter<ServiceClientDBO, ServiceClient>
{
  public build(data: ServiceClientDBO): Result<ServiceClient> {
    const serviceClient = ServiceClient.create({
      clientId: ID.create(data.client_id),
      keys: data.modules_keys,
    });

    if (serviceClient.isFail()) return Result.fail(serviceClient.error());

    return Result.Ok(serviceClient.value());
  }
}
