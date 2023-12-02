import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';
import { CreateWaiverBalanceToClientDTO } from '@modules/apis/waiver/infra/api/dtos/balance';

type Input = CreateWaiverBalanceToClientDTO;
type Output = any;

export class CreateWaiverBalance implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const createBalance = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlWaiver}/balance/${data.clientId}`,
      method: 'post',
      body: data,
      module: 'waiver',
    });

    if (createBalance.isFail()) return Result.fail(createBalance.error());

    return Result.Ok(createBalance.value().response);
  }
}
