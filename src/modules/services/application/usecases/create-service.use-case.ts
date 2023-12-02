import { IServiceRepository, Service } from '@modules/services/domain';

import { generateKeyByString } from '@shared/helpers';
import { IUseCase, Result } from 'types-ddd';
import {
  CreateServiceUseCaseDTOInput,
  CreateServiceUseCaseDTOOutput,
} from './dtos';

type Input = CreateServiceUseCaseDTOInput;
type Output = CreateServiceUseCaseDTOOutput;

export class CreateService implements IUseCase<Input, Result<Output>> {
  constructor(private readonly serviceGroupRepository: IServiceRepository) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const key = generateKeyByString(data.name);

    if (!data.label) {
      return Result.fail('Label não informado');
    }

    const newService = Service.create({
      key,
      name: data.name,
      standard: data.standard,
      active: data.active ?? true,
      label: data.label,
    });

    if (newService.isFail()) return Result.fail(newService.error());

    const service = await this.serviceGroupRepository.createService(
      newService.value(),
    );

    if (service.isFail()) return Result.fail(service.error());

    return Result.Ok({
      id: service.value().id,
    });
  }
}
