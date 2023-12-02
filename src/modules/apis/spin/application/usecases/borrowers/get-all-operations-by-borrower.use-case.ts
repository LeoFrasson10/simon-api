import { makeGetClientById } from '@modules/client';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  clientId: string;
};
type Output = any;

export class GetAllOperationsByBorrower
  implements IUseCase<Input, Result<Output>>
{
  public async execute(data: Input): Promise<Result<Output>> {
    const client = await makeGetClientById().execute({
      clientId: data.clientId,
    });

    if (client.isFail()) return Result.fail(client.error());

    const integrationId = client.value().integrationId;

    const operations = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/borrower/operations/${client.value().id}`,
      method: 'get',
      module: 'spin',
      integrationId,
    });

    if (operations.isFail()) return Result.fail(operations.error());

    return Result.Ok(Object.values(operations.value().response));
  }
}
