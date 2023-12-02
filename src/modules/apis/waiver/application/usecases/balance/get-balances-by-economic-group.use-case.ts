import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  economicGroupId: string;
  currentDate: string;
};
type Output = any;

export class GetWaiverBalancesByEconomicGroupId
  implements IUseCase<Input, Result<Output>>
{
  public async execute(data: Input): Promise<Result<Output>> {
    const client = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlWaiver}/balance/economic-group/${data.economicGroupId}`,
      method: 'get',
      module: 'waiver',
      params: {
        'current-date': data.currentDate,
      },
    });

    if (client.isFail()) return Result.fail(client.error());

    return Result.Ok(Object.values(client.value().response));
  }
}
