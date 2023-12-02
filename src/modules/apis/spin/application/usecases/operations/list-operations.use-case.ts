import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  userId: string;
  page: number;
  pageSize?: number;
  document?: string;
};
type Output = any;

export class ListOperations implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const operations = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/operation/list`,
      method: 'get',
      module: 'spin',
      headers: {
        'user-id': data.userId,
      },
      params: {
        ...data,
      },
    });

    if (operations.isFail()) return Result.fail(operations.error());

    return Result.Ok(operations.value().response);
  }
}
