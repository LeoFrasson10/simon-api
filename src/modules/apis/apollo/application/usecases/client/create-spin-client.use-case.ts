import { makeGetIntegrationById } from '@modules/integrations';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';
import { CreateApolloClientDTORequest } from '@modules/apis/apollo/infra/api/dtos';

type Input = CreateApolloClientDTORequest;
type Output = any;

export class CreateApolloClient implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const integration = await makeGetIntegrationById().execute({
      integrationId: data.integrationId,
    });

    if (integration.isFail()) return Result.fail(integration.error());

    const createClient = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlApollo}/client`,
      method: 'post',
      body: data,
      module: 'apollo',
      integrationId: data.integrationId,
    });

    if (createClient.isFail()) return Result.fail(createClient.error());

    return Result.Ok(createClient.value().response);
  }
}
