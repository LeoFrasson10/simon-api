import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  month: string;
};
type Output = any;

export class InsertTransactionsByMonth
  implements IUseCase<Input, Result<Output>>
{
  public async execute(data: Input): Promise<Result<Output>> {
    const acceptMonth = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];

    if (!acceptMonth.includes(data.month)) {
      return Result.fail(
        `Mês inválido, informar entre ${acceptMonth.map((m) => m)}`,
      );
    }

    const insert = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlAcquiring}/transactions/insert`,
      method: 'post',
      module: 'acquiring',
      body: {
        month: data.month,
      },
    });

    if (insert.isFail()) return Result.fail(insert.error());

    return Result.Ok(insert.value().response);
  }
}
