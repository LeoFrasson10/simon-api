import { CreateWithdrawalSolicitationDTO } from '@modules/apis/waiver/infra';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = CreateWithdrawalSolicitationDTO;
type Output = any;

export class CreateWaiverWithdrawalSolicitation
  implements IUseCase<Input, Result<Output>>
{
  public async execute(data: Input): Promise<Result<Output>> {
    const solicitation = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlWaiver}/withdrawal-solicitation/${data.clientId}`,
      method: 'post',
      module: 'waiver',
      body: data,
    });

    if (solicitation.isFail()) return Result.fail(solicitation.error());

    return Result.Ok(solicitation.value().response);
  }
}
