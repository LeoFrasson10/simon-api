import { UpdateOperationsStatusEntry } from '@modules/apis';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';
import { IUseCase, Result } from 'types-ddd';

type Input = UpdateOperationsStatusEntry;
type Output = any;

export class UpdateStatusOperations implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const response = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/operation/update-proposals`,
      method: 'put',
      body: data,
      module: 'spin',
    });

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(Object.values(response.value().response));
  }
}
