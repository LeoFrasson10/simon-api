import { IClientRepository } from '@modules/client/domain';
import { IEconomicGroupRepository } from '@modules/economic-group';

import { IUseCase, Result } from 'types-ddd';
import {
  UpdateClientUseCaseDTOInput,
  UpdateClientUseCaseDTOOutput,
} from './dtos';

type Input = UpdateClientUseCaseDTOInput;
type Output = UpdateClientUseCaseDTOOutput;

export class UpdateClient implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly economicGroupRepository: IEconomicGroupRepository,
  ) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const isExistsClient = await this.clientRepository.findClientById(data.id);

    if (isExistsClient.isFail()) {
      return Result.fail(isExistsClient.error());
    }

    const clientInstance = isExistsClient.value();

    if (data.economicGroupId) {
      const economicGroup =
        await this.economicGroupRepository.findEconomicGroupById(
          data.economicGroupId,
        );

      if (economicGroup.isFail()) {
        return Result.fail(economicGroup.error());
      }

      clientInstance.setEconomicGroupId(economicGroup.value().id.value());
    }

    clientInstance.setEstablishmentId(data.establishmentId);

    const client = await this.clientRepository.update(
      clientInstance,
      data.standardServices
        ? data.standardServices
        : isExistsClient.value().get('serviceClient').value().get('keys'),
    );

    if (client.isFail()) return Result.fail(client.error());

    return Result.Ok({
      id: client.value().id,
    });
  }
}
