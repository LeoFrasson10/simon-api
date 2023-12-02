import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  integrationId: string;
  filters: {
    page?: number;
    pageSize?: number;
    rating?: string;
  };
};
type Output = any;

export class GetSpinAllRules implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const term = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/rating-rule`,
      method: 'get',
      module: 'spin',
      params: { ...data.filters },
      integrationId: data.integrationId,
    });

    if (term.isFail()) return Result.fail(term.error());

    return Result.Ok(term.value().response);
  }
}
