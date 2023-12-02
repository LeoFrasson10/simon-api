import { IAdapter, ID, Result } from 'types-ddd';
import { IntegrationDBO } from '@modules/integrations/infra';
import { Integration } from '../aggregates';
import { AdapterServiceIntegrationDBOToDomain } from '@modules/service-integration';

export class AdapterIntegrationDBOToDomain
  implements IAdapter<IntegrationDBO, Integration>
{
  public build(data: IntegrationDBO): Result<Integration> {
    const serviceIntegrationAdapter =
      new AdapterServiceIntegrationDBOToDomain();
    const integration = Integration.create({
      id: ID.create(data.id),
      name: data.name,
      email: data.email,
      active: data.active,
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      autoApproved: data.auto_approved,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      document: data.document,
      origin: data.origin,
      credentials: data.credentials,
      key: data.key,
      fullAccess: data.full_access,
      integrationService: data.services
        ? data.services.map((s) => serviceIntegrationAdapter.build(s))
        : null,
    });

    if (integration.isFail()) return Result.fail(integration.error());

    return Result.Ok(integration.value());
  }
}
