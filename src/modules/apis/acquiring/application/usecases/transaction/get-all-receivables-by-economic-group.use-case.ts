import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';
import { GetReceivablesByEconomicGroupUseCaseInput } from './dtos';

type Input = GetReceivablesByEconomicGroupUseCaseInput;
type Output = any;

export class GetAcquiringReceivablesByEconomicGroup
  implements IUseCase<Input, Result<Output>>
{
  public async execute(data: Input): Promise<Result<Output>> {
    if (!data.establishmentIds) {
      return Result.fail('Informe no mínimo 1 estabelecimento');
    }

    const establishmentIds = data.establishmentIds.split(',');

    if (establishmentIds.length === 0) {
      return Result.fail('Informe no mínimo 1 estabelecimento');
    }

    const client = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlAcquiring}/transactions/receivables/economic-group`,
      method: 'get',
      module: 'acquiring',
      params: data,
    });

    if (client.isFail()) return Result.fail(client.error());

    return Result.Ok(client.value().response);
  }
}
