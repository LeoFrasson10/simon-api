import { CreateBorrowerDTO } from '@modules/apis';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = CreateBorrowerDTO;
type Output = any;

export class CreateBorrower implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const createBorrower = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/borrower`,
      method: 'post',
      body: data,
      module: 'spin',
      integrationId: data.integrationId,
    });

    if (createBorrower.isFail()) return Result.fail(createBorrower.error());

    return Result.Ok(createBorrower.value().response);
  }
}
