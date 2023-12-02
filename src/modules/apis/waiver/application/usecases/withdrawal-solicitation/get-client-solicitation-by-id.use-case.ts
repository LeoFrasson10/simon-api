import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  solicitationId: string;
};
type Output = any;

export class GetWaiverSolicitationById
  implements IUseCase<Input, Result<Output>>
{
  public async execute(data: Input): Promise<Result<Output>> {
    const solicitation = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlWaiver}/withdrawal-solicitation/${data.solicitationId}`,
      method: 'get',
      module: 'waiver',
    });

    if (solicitation.isFail()) return Result.fail(solicitation.error());

    return Result.Ok(solicitation.value().response);
  }
}
