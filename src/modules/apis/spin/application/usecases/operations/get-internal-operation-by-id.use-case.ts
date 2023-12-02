import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  operationId: string;
  clientId: string;
};
type Output = any;

export class GetInternalOperationById
  implements IUseCase<Input, Result<Output>>
{
  public async execute(data: Input): Promise<Result<Output>> {
    const operation = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/operation/internal/${data.clientId}/${data.operationId}`,
      method: 'get',
      module: 'spin',
    });

    if (operation.isFail()) return Result.fail(operation.error());

    return Result.Ok(operation.value().response);
  }
}
