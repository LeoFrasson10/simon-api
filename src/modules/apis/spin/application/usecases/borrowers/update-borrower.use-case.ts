import { UpdateBorrowerDTO } from '@modules/apis/spin/infra';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = UpdateBorrowerDTO & {
  integrationId: string;
};
type Output = any;

export class UpdateBorrower implements IUseCase<Input, Result<Output>> {
  public async execute({
    id,
    integrationId,
    ...rest
  }: Input): Promise<Result<Output>> {
    const response = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/borrower/${id}`,
      method: 'put',
      body: {
        ...rest,
      },
      module: 'spin',
      integrationId: integrationId,
    });

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(response.value().response);
  }
}
