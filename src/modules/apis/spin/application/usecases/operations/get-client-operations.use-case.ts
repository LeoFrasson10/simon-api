import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  integrationId: string;
};
type Output = any;

export class GetClientOperations implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const operations = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/operation/client/${data.integrationId}`,
      method: 'get',
      module: 'spin',
      integrationId: data.integrationId,
    });

    if (operations.isFail()) return Result.fail(operations.error());

    return Result.Ok(Object.values(operations.value().response));
  }
}
