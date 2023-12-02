import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  clientId: string;
};
type Output = any;

export class GetWaiverAllWithdrawalClient
  implements IUseCase<Input, Result<Output>>
{
  public async execute(data: Input): Promise<Result<Output>> {
    const clients = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlWaiver}/withdrawal-solicitation/clients-balances/${data.clientId}`,
      method: 'get',
      module: 'waiver',
    });

    if (clients.isFail()) return Result.fail(clients.error());

    return Result.Ok(Object.values(clients.value().response));
  }
}
