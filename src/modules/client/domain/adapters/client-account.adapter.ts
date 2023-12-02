import { IAdapter, ID, Result } from 'types-ddd';
import { ClientAccount } from '../aggregates';
import { ClientAccountDBO } from '@modules/client/infra';

export class AdapterClientAccountDBOToDomain
  implements IAdapter<ClientAccountDBO, ClientAccount>
{
  public build(data: ClientAccountDBO): Result<ClientAccount> {
    const clientAccount = ClientAccount.create({
      accountNumber: data.account_number,
      accountType: data.account_type,
      baasAccountId: data.baas_account_id,
      bankNumber: data.bank_number,
      branchNumber: data.branch_number,
      clientId: ID.create(data.client_id),
      branchDigit: data.branch_digit,
      id: ID.create(data.id),
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    });

    if (clientAccount.isFail()) return Result.fail(clientAccount.error());

    return Result.Ok(clientAccount.value());
  }
}
