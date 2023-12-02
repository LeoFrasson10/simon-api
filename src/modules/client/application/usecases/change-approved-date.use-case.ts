import { IClientRepository } from '@modules/client/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  ChangeApprovedDateUseCaseDTOInput,
  ChangeApprovedDateUseCaseDTOOutput,
} from './dtos';

type Input = ChangeApprovedDateUseCaseDTOInput;
type Output = ChangeApprovedDateUseCaseDTOOutput;

export class ChangeApprovedDateClient
  implements IUseCase<Input, Result<Output>>
{
  constructor(private readonly clientRepository: IClientRepository) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const isExistsClient = await this.clientRepository.findClientById(data.id);

    if (isExistsClient.isFail()) {
      return Result.fail(isExistsClient.error());
    }

    if (!data.approvedDate) {
      return Result.fail('Data de aprovação não informada');
    }

    const clientInstance = isExistsClient.value();

    clientInstance.change('approvedDate', new Date(data.approvedDate));

    const clientUpdated = await this.clientRepository.changeClientApprovedDate(
      clientInstance,
    );

    if (clientUpdated.isFail()) return Result.fail(clientUpdated.error());

    return Result.Ok({
      id: clientUpdated.value().id,
    });
  }
}
