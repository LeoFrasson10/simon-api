import { IServiceRepository } from '@modules/services/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  GetServicesUseCaseDTOInput,
  GetServicesUseCaseDTOOutput,
} from './dtos';

type Input = GetServicesUseCaseDTOInput;
type Output = GetServicesUseCaseDTOOutput;

export class GetServicesByKeys implements IUseCase<Input, Result<Output>> {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  public async execute({ keys }: Input): Promise<Result<Output>> {
    const service = await this.serviceRepository.getServicesByKeys(keys);

    if (service.isFail()) return Result.fail(service.error());

    const serviceInstance = service.value();

    return Result.Ok(
      serviceInstance.map((s) => ({
        id: s.id.value(),
        name: s.get('name'),
        active: s.get('active'),
        key: s.get('key'),
        label: s.get('label'),
        standard: s.get('standard'),
        createdAt: s.get('createdAt'),
        updatedAt: s.get('updatedAt'),
      })),
    );
  }
}
