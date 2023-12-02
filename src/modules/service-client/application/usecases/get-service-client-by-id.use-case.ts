import { IServiceClientRepository } from '@modules/service-client/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  GetServiceClientUseCaseDTOInput,
  GetServiceClientUseCaseDTOOutput,
} from './dtos';

type Input = GetServiceClientUseCaseDTOInput;
type Output = GetServiceClientUseCaseDTOOutput;

export class GetServiceClientById implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly serviceClientRepository: IServiceClientRepository,
  ) {}

  public async execute({ id }: Input): Promise<Result<Output>> {
    const service = await this.serviceClientRepository.findServiceClientById(
      id,
    );

    if (service.isFail()) return Result.fail(service.error());

    const serviceInstance = service.value();

    return Result.Ok({
      ...serviceInstance.toObject(),
    });
  }
}
