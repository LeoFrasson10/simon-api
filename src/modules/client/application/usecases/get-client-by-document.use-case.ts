import { IClientRepository } from '@modules/client/domain';

import { IUseCase, Result } from 'types-ddd';
import { GetClientUseCaseDTOInput, GetClientUseCaseDTOOutput } from './dtos';

type Input = GetClientUseCaseDTOInput;
type Output = GetClientUseCaseDTOOutput;

export class GetUserByDocument implements IUseCase<Input, Result<Output>> {
  constructor(private readonly clientRepository: IClientRepository) {}

  public async execute({ document }: Input): Promise<Result<Output>> {
    const client = await this.clientRepository.findClientByDocument(document);

    if (client.isFail()) return Result.fail(client.error());

    return Result.Ok({
      ...client.value().toObject(),
    });
  }
}
