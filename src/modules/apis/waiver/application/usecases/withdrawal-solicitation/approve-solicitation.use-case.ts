import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  userId: string;
  id: string;
};
type Output = any;

export class ApproveSolicitation implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const solicitation = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlWaiver}/withdrawal-solicitation/approved/${data.id}`,
      method: 'put',
      module: 'waiver',
      body: {
        userId: data.userId,
      },
    });

    if (solicitation.isFail()) return Result.fail(solicitation.error());

    return Result.Ok(solicitation.value().response);
  }
}
