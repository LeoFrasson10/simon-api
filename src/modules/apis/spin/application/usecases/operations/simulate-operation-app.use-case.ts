import { SimulateParams } from '@modules/apis';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = SimulateParams;
type Output = any;

export class SimulateOperationApp implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const simulation = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/operation/simulate`,
      method: 'post',
      body: data,
      module: 'spin',
    });

    if (simulation.isFail()) return Result.fail(simulation.error());

    return Result.Ok(simulation.value().response);
  }
}
