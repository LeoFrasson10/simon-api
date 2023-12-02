import { IClientRepository } from '@modules/client/domain';

import { IUseCase, Result } from 'types-ddd';
import { GetClientUseCaseDTOInput, GetClientsUseCaseDTOOutput } from './dtos';
import { makeGetEconomicGroupById } from '@modules/economic-group';

type Input = GetClientUseCaseDTOInput;
type Output = GetClientsUseCaseDTOOutput;

export class GetClientsByEconomicGroup
  implements IUseCase<Input, Result<Output>>
{
  constructor(private readonly clientRepository: IClientRepository) {}

  public async execute({ economicGroupId }: Input): Promise<Result<Output>> {
    const economicGroup = await makeGetEconomicGroupById().execute({
      economicGroupId,
    });

    if (economicGroup.isFail()) return Result.fail(economicGroup.error());

    const clients = await this.clientRepository.findClientsByEconomicGroup(
      economicGroupId,
    );

    if (clients.isFail()) return Result.fail(clients.error());
    const listingInstance = clients.value();

    return Result.Ok(
      listingInstance.map((client) => ({
        ...client.toObject(),
        integration: client.get('integration').value().toObject(),
        serviceClient: client.get('serviceClient').value().toObject(),
        accounts: client.get('accounts')
          ? client.get('accounts').value().toObject()
          : null,
        operators: client.get('operators').map((op) => op.value().toObject()),
        partners: client.get('partners').map((p) => p.value().toObject()),
        economicGroupId: client.get('economicGroup')
          ? client.get('economicGroup').value().id.value()
          : null,
        economicGroup: client.get('economicGroup')
          ? {
              ...client.get('economicGroup').value().toObject(),
              contacts: client
                .get('economicGroup')
                .value()
                .get('contacts')
                .map((c) => c.value().toObject()),
            }
          : null,
      })),
    );
  }
}
