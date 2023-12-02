import { ContractDBO } from '@modules/contracts/infra';
import { IAdapter, ID, Result } from 'types-ddd';
import { Contract } from '../aggregates';

export class AdapterContractOperatorDBOToDomain
  implements IAdapter<ContractDBO, Contract>
{
  public build(data: ContractDBO): Result<Contract> {
    const contract = Contract.create({
      description: data.description,
      filename: data.filename,
      path: data.path,
      title: data.title,
      userId: data.user_id ? ID.create(data.user_id) : null,
      version: data.version,
      details: data.details,
      useSpreadsheet: data.use_spreadsheet,
      id: ID.create(data.id),
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    });

    if (contract.isFail()) return Result.fail(contract.error());

    return Result.Ok(contract.value());
  }
}
