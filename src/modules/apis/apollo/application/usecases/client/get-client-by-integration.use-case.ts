import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  integrationId: string;
};
type Output = any;

export class GetApolloClientByIntegration
  implements IUseCase<Input, Result<Output>>
{
  public async execute(data: Input): Promise<Result<Output>> {
    const client = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlApollo}/client/integration/${data.integrationId}`,
      method: 'get',
      module: 'apollo',
      integrationId: data.integrationId,
    });

    if (client.isFail()) return Result.fail(client.error());

    return Result.Ok(client.value().response);
  }
}
