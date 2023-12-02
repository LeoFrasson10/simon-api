import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';
import { GetReceivablesUseCaseInput } from './dtos';

type Input = GetReceivablesUseCaseInput;
type Output = any;

export class GetAcquiringReceivables
  implements IUseCase<Input, Result<Output>>
{
  public async execute(params: Input): Promise<Result<Output>> {
    const client = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlAcquiring}/transactions/receivables`,
      method: 'get',
      module: 'acquiring',
      params: params,
    });

    if (client.isFail()) return Result.fail(client.error());

    return Result.Ok(client.value().response);
  }
}
