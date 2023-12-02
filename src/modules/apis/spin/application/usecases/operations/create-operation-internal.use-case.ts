import { ProposalFormEntries } from '@modules/apis';
import { makeGetClientById } from '@modules/client';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = ProposalFormEntries & {
  cliendId: string;
  files: Array<Express.Multer.File>;
  ip?: string;
};
type Output = any;

export class CreateInternalOperation
  implements IUseCase<Input, Result<Output>>
{
  public async execute(data: Input): Promise<Result<Output>> {
    const client = await makeGetClientById().execute({
      clientId: data.cliendId,
    });

    if (client.isFail()) {
      return Result.fail(client.error());
    }

    const body = {
      ...data,
      company: client.value(),
    };

    const createOperation = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/operation/proposal/${data.cliendId}`,
      method: 'post',
      body: body,
      module: 'spin',
    });

    if (createOperation.isFail()) return Result.fail(createOperation.error());

    return Result.Ok(createOperation.value().response);
  }
}
