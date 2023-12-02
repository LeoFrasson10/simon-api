import {
  IServiceClientRepository,
  ServiceClient,
} from '@modules/service-client/domain';

import { ID, IUseCase, Result } from 'types-ddd';
import {
  CreateServiceClientUseCaseDTOInput,
  CreateServiceClientUseCaseDTOOutput,
} from './dtos';
import { makeGetClientById } from '@modules/client';

type Input = CreateServiceClientUseCaseDTOInput;
type Output = CreateServiceClientUseCaseDTOOutput;

export class CreateServiceClient implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly serviceClientRepository: IServiceClientRepository,
  ) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const client = await makeGetClientById().execute({
      clientId: data.clientId,
    });

    if (client.isFail()) return Result.fail(client.error());

    const newIntegration = ServiceClient.create({
      clientId: ID.create(data.clientId),
      keys: data.keys,
    });

    if (newIntegration.isFail()) return Result.fail(newIntegration.error());

    const service = await this.serviceClientRepository.createServiceClient(
      newIntegration.value(),
    );

    if (service.isFail()) return Result.fail(service.error());

    return Result.Ok(service.value());
  }
}
