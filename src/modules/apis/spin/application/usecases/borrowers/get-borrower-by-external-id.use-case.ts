import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  clientId: string;
  integrationId: string;
};
type Output = any;

export class GetBorrowerByExternalId
  implements IUseCase<Input, Result<Output>>
{
  public async execute({
    integrationId,
    clientId,
  }: Input): Promise<Result<Output>> {
    const borrower = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/borrower/external/${clientId}`,
      method: 'get',
      module: 'spin',
      integrationId,
    });

    if (borrower.isFail()) return Result.fail(borrower.error());

    return Result.Ok(borrower.value().response);
  }
}
