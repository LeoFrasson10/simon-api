import { CreateSpinTermDTO } from '@modules/apis';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = CreateSpinTermDTO;
type Output = any;

export class CreateSpinTerm implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const createTerm = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/term`,
      method: 'post',
      body: data,
      module: 'spin',
      integrationId: data.integrationId,
    });

    if (createTerm.isFail()) return Result.fail(createTerm.error());

    return Result.Ok(createTerm.value().response);
  }
}
