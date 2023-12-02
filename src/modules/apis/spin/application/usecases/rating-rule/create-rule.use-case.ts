import { CreateRuleDTO } from '@modules/apis';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = CreateRuleDTO;
type Output = any;

export class CreateSpinRule implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const createRule = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/rating-rule`,
      method: 'post',
      body: data,
      module: 'spin',
      integrationId: data.integrationId,
    });

    if (createRule.isFail()) return Result.fail(createRule.error());

    return Result.Ok(createRule.value().response);
  }
}
