import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  clientExtId: string;
};
type Output = any;

export class GetWaiverClientByExtId implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const client = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlWaiver}/client/external/${data.clientExtId}`,
      method: 'get',
      module: 'waiver',
    });

    if (client.isFail()) return Result.fail(client.error());

    return Result.Ok(client.value().response);
  }
}
