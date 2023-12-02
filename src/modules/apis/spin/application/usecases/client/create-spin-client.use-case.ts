import { makeGetIntegrationById } from '@modules/integrations';
import { CreateSpinClientDTO } from '@modules/apis';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = CreateSpinClientDTO;
type Output = any;

export class CreateSpinClient implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const integration = await makeGetIntegrationById().execute({
      integrationId: data.integrationId,
    });

    if (integration.isFail()) return Result.fail(integration.error());

    const createBorrower = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/client`,
      method: 'post',
      body: data,
      module: 'spin',
      integrationId: data.integrationId,
    });

    if (createBorrower.isFail()) return Result.fail(createBorrower.error());

    return Result.Ok(createBorrower.value().response);
  }
}
