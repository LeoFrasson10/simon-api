import { CreateOperationClientDTO } from '@modules/apis';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = CreateOperationClientDTO & {
  integrationId: string;
};
type Output = any;

export class CreateClientOperation implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const createOperation = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/operation/client/${data.integrationId}`,
      method: 'post',
      body: data,
      module: 'spin',
      integrationId: data.integrationId,
    });

    if (createOperation.isFail()) return Result.fail(createOperation.error());

    return Result.Ok(createOperation.value().response);
  }
}
