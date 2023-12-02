import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = any;
type Output = any;

export class GetWaiverAllClient implements IUseCase<Input, Result<Output>> {
  public async execute(): Promise<Result<Output>> {
    const client = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlWaiver}/client`,
      method: 'get',
      module: 'waiver',
    });

    if (client.isFail()) return Result.fail(client.error());

    return Result.Ok(Object.values(client.value().response));
  }
}
