import { Client, IClientRepository } from '@modules/client/domain';
import { makeGetIntegrationById } from '@modules/integrations';
import { makeGetStandardServices } from '@modules/services';

import { ID, IUseCase, Result } from 'types-ddd';
import {
  CreateClientByIntegrationUseCaseDTOInput,
  CreateClientUseCaseDTOOutput,
} from './dtos';

type Input = CreateClientByIntegrationUseCaseDTOInput;
type Output = CreateClientUseCaseDTOOutput;

export class CreateClientIntegration
  implements IUseCase<Input, Result<Output>>
{
  constructor(private readonly clientRepository: IClientRepository) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const integration = await makeGetIntegrationById().execute({
      integrationId: data.integrationId,
    });

    if (integration.isFail()) {
      return Result.fail(integration.error());
    }

    const isExistsClient =
      await this.clientRepository.findClientByDocumentAndIntegration(
        data.document,
        data.integrationId,
      );

    if (isExistsClient.value()) {
      return Result.fail('Cliente já cadastrado');
    }

    const standardServices = await makeGetStandardServices().execute();

    if (standardServices.isFail()) return Result.fail(standardServices.error());

    const newClient = Client.create({
      integrationId: ID.create(integration.value().id),
      name: data.name,
      email: data.email,
      document: data.document,
      street: data.street,
      number: data.number,
      complement: data.complement,
      zip: data.zip,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      country: data.country,
      monthlyInvoicing: data.monthlyInvoicing,
      phone: data.phone,
      establishmentId: data.establishmentId,
    });

    if (newClient.isFail()) {
      return Result.fail(newClient.error());
    }
    const modulesKeys = standardServices.value().data.map((e) => e.key);
    const createdClient = await this.clientRepository.createByIntegration(
      newClient.value(),
      modulesKeys,
    );

    if (createdClient.isFail()) return Result.fail(createdClient.error());

    return Result.Ok({
      ...createdClient.value(),
    });
  }
}
