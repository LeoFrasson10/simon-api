import { makeGetClientById } from '@modules/client';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  clientId: string;
};
type Output = any;

export class GetLimitBorrower implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const client = await makeGetClientById().execute({
      clientId: data.clientId,
    });

    if (client.isFail()) return Result.fail(client.error());

    const integrationId = client.value().integrationId;
    const limit = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/borrower/limit/${client.value().id}`,
      method: 'get',
      module: 'spin',
      integrationId,
    });

    if (limit.isFail()) return Result.fail(limit.error());

    return Result.Ok(limit.value().response);
  }
}
