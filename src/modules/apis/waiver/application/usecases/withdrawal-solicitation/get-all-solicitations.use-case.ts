import { GetAllSolicitationAdminResponse } from '@modules/apis/waiver/infra';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  clientId?: string;
};
type Output = GetAllSolicitationAdminResponse[];

export class GetWaiverAllSolicitations
  implements IUseCase<Input, Result<Output>>
{
  public async execute(data: Input): Promise<Result<Output>> {
    if (data.clientId) {
      const solicitations = await makeHttpClient().requestExternalModule({
        url: `${services.baseUrlWaiver}/withdrawal-solicitation/client/${data.clientId}`,
        method: 'get',
        module: 'waiver',
      });
      if (solicitations.isFail()) return Result.fail(solicitations.error());

      return Result.Ok(Object.values(solicitations.value().response));
    }
    const solicitations = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlWaiver}/withdrawal-solicitation`,
      method: 'get',
      module: 'waiver',
    });

    if (solicitations.isFail()) return Result.fail(solicitations.error());

    return Result.Ok(Object.values(solicitations.value().response));
  }
}
