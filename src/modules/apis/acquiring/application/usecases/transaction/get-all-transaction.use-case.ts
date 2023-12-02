import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';
import { GetTransactionsUseCaseInput } from './dtos';

type Input = GetTransactionsUseCaseInput;
type Output = any;

export class GetAcquiringAllTransaction
  implements IUseCase<Input, Result<Output>>
{
  public async execute(params: Input): Promise<Result<Output>> {
    const [transactions, totalAmountTransactions] = await Promise.all([
      makeHttpClient().requestExternalModule({
        url: `${services.baseUrlAcquiring}/transactions`,
        method: 'get',
        module: 'acquiring',
        params: { ...params, limit: params.limitData },
      }),
      makeHttpClient().requestExternalModule({
        url: `${services.baseUrlAcquiring}/transactions-total-amount`,
        method: 'get',
        module: 'acquiring',
        params: { ...params, limit: params.limitData },
      }),
    ]);

    if (transactions.isFail()) return Result.fail(transactions.error());

    if (totalAmountTransactions.isFail())
      return Result.fail(totalAmountTransactions.error());

    return Result.Ok({
      ...transactions.value().response,
      ...totalAmountTransactions.value().response,
    });
  }
}
