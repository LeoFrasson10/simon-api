import { IClientRepository } from '@modules/client/domain';
import { IUseCase, Result } from 'types-ddd';
import { GetClientUseCaseDTOInput, GetClientUseCaseDTOOutput } from './dtos';

type Input = GetClientUseCaseDTOInput;
type Output = GetClientUseCaseDTOOutput;

export class GetClientById implements IUseCase<Input, Result<Output>> {
  constructor(private readonly clientRepository: IClientRepository) {}

  public async execute({ clientId }: Input): Promise<Result<Output>> {
    const client = await this.clientRepository.findClientById(clientId);

    if (client.isFail()) return Result.fail(client.error());

    const clientInstance = client.value();

    return Result.Ok({
      ...clientInstance.toObject(),
      integration: clientInstance.get('integration').value().toObject(),
      integrationId: clientInstance.get('integrationId').value(),
      serviceClient: clientInstance.get('serviceClient').value().toObject(),
      accounts: clientInstance.get('accounts')?.value().toObject(),
      operators: clientInstance
        .get('operators')
        .map((op) => op.value().toObject()),
      partners: clientInstance.get('partners').map((p) => p.value().toObject()),
      economicGroupId: clientInstance.get('economicGroup')
        ? clientInstance.get('economicGroup').value().id.value()
        : null,
      economicGroup: clientInstance.get('economicGroup')
        ? {
            ...clientInstance.get('economicGroup').value().toObject(),
            contacts: clientInstance
              .get('economicGroup')
              .value()
              .get('contacts')
              .map((c) => c.value().toObject()),
          }
        : null,
    });
  }
}
