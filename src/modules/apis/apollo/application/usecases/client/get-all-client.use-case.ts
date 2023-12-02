import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  integrationId: string;
};
type Output = any;

export class GetApolloClients implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const clients = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlApollo}/client`,
      method: 'get',
      module: 'apollo',
      integrationId: data.integrationId,
    });

    if (clients.isFail()) return Result.fail(clients.error());

    return Result.Ok(clients.value().response);
  }
}
