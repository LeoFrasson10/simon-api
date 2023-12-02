import { SimulateParams } from '@modules/apis';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = SimulateParams & {
  integrationId: string;
};
type Output = any;

export class SimulateOperationClient
  implements IUseCase<Input, Result<Output>>
{
  public async execute(data: Input): Promise<Result<Output>> {
    const simulation = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/operation/client/simulate/${data.integrationId}`,
      method: 'post',
      body: data,
      module: 'spin',
      integrationId: data.integrationId,
    });

    if (simulation.isFail()) return Result.fail(simulation.error());

    return Result.Ok(simulation.value().response);
  }
}
