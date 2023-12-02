import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  docs: string[];
  integrationId: string;
};
type Output = any;

export class UpdateAnalysingBorrowers
  implements IUseCase<Input, Result<Output>>
{
  public async execute(data: Input): Promise<Result<Output>> {
    const response = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/operation/analysing-documents/${data.integrationId}`,
      method: 'put',
      body: data.docs,
      module: 'spin',
      integrationId: data.integrationId,
    });

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(response.value().response);
  }
}
