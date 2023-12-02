import { IAdapter, ID, Result } from 'types-ddd';
import { ClientOperators } from '../aggregates';
import { ClientOperatorsDBO } from '@modules/client/infra';

export class AdapterClientOperatorDBOToDomain
  implements IAdapter<ClientOperatorsDBO, ClientOperators>
{
  public build(data: ClientOperatorsDBO): Result<ClientOperators> {
    const clientOperator = ClientOperators.create({
      document: data.document,
      email: data.email,
      name: data.name,
      blocked: data.blocked,
      clientId: ID.create(data.client_id),
      permission: data.permission,
      id: ID.create(data.id),
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    });

    if (clientOperator.isFail()) return Result.fail(clientOperator.error());

    return Result.Ok(clientOperator.value());
  }
}
