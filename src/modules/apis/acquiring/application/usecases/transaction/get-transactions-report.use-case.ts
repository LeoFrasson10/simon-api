import { GetTransactionsReportRequest } from '@modules/apis/acquiring/infra';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = GetTransactionsReportRequest;
type Output = any;

export class GetAcquiringTransactionsReport
  implements IUseCase<Input, Result<Output>>
{
  public async execute(params: Input): Promise<Result<Output>> {
    const response = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlAcquiring}/transactions/report`,
      method: 'get',
      module: 'acquiring',
      params: params,
    });

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(response.value().response);
  }
}
