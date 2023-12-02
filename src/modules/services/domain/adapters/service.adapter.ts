import { Service } from '@modules/services/domain';
import { ServiceDBO } from '@modules/services/infra';
import { IAdapter, ID, Result } from 'types-ddd';

export class AdapterServiceDBOToDomain
  implements IAdapter<ServiceDBO, Service>
{
  public build(data: ServiceDBO): Result<Service> {
    const service = Service.create({
      id: ID.create(data.id),
      active: data.active,
      name: data.name,
      label: data.label,
      key: data.key,
      standard: data.standard,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    });

    if (service.isFail()) return Result.fail(service.error());

    return Result.Ok(service.value());
  }
}
