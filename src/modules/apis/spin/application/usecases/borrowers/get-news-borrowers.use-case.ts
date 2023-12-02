import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  integrationId: string;
};
type Output = any;

export class GetNewsBorrowers implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const borrowers = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/operation/new-documents/${data.integrationId}`,
      method: 'get',
      module: 'spin',
      integrationId: data.integrationId,
    });

    if (borrowers.isFail())
      return Result.fail(borrowers.error(), borrowers.metaData());

    return Result.Ok(Object.values(borrowers.value().response));
  }
}
