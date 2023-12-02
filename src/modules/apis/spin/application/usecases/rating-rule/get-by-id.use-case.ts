import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  integrationId: string;
  ruleId: string;
};
type Output = any;

export class GetSpinRuleById implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const rule = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/rating-rule/${data.ruleId}`,
      method: 'get',
      module: 'spin',
      integrationId: data.integrationId,
    });

    if (rule.isFail()) return Result.fail(rule.error());

    return Result.Ok(rule.value().response);
  }
}
