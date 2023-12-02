import { OperationClientResponse } from '@modules/apis/spin/infra';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  operationId: string;
  integrationId: string;
};
type Output = OperationClientResponse;

export class GetClientOperationById implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const operation = await makeHttpClient().requestExternalModule<
      Input,
      Output
    >({
      url: `${services.baseUrlSpin}/operation/client/${data.integrationId}/${data.operationId}`,
      method: 'get',
      module: 'spin',
      integrationId: data.integrationId,
    });

    if (operation.isFail()) return Result.fail(operation.error());

    return Result.Ok(operation.value().response);
  }
}
