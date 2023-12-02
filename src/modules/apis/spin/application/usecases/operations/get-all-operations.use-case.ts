import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = any;
type Output = any;

export class GetAllOperations implements IUseCase<Input, Result<Output>> {
  public async execute(): Promise<Result<Output>> {
    const borrowers = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/operation/all-proposals`,
      method: 'get',
      module: 'spin',
    });

    if (borrowers.isFail()) return Result.fail(borrowers.error());

    return Result.Ok(Object.values(borrowers.value().response));
  }
}
