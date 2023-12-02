import { IServiceRepository } from '@modules/services/domain';

import { IUseCase, Result } from 'types-ddd';
import { GetServiceUseCaseDTOInput, GetServiceUseCaseDTOOutput } from './dtos';

type Input = GetServiceUseCaseDTOInput;
type Output = GetServiceUseCaseDTOOutput;

export class GetServiceById implements IUseCase<Input, Result<Output>> {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  public async execute({ serviceId }: Input): Promise<Result<Output>> {
    const service = await this.serviceRepository.findServiceById(serviceId);

    if (service.isFail()) return Result.fail(service.error());

    return Result.Ok({
      ...service.value().toObject(),
    });
  }
}
