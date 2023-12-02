import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  integrationId: string;
  type: string;
};
type Output = any;

export class GetSpinTerm implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const term = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/term`,
      method: 'get',
      module: 'spin',
      params: {
        type: data.type,
      },
      integrationId: data.integrationId,
    });

    if (term.isFail()) return Result.fail(term.error());

    return Result.Ok(term.value().response);
  }
}
