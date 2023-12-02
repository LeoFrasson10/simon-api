import { IServiceRepository } from '@modules/services/domain';

import { IUseCase, Result } from 'types-ddd';
import { ListServicesStandardUseCaseDTOOutput } from './dtos';

type Input = any;
type Output = ListServicesStandardUseCaseDTOOutput;

export class GetStandardServices implements IUseCase<Input, Result<Output>> {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  public async execute(): Promise<Result<Output>> {
    const service = await this.serviceRepository.getStandarServices();

    if (service.isFail()) return Result.fail(service.error());

    const listingInstance = service.value();

    return Result.Ok({
      data: listingInstance.data.map((i) => {
        return {
          id: i.get('id').value(),
          name: i.get('name'),
          key: i.get('key'),
          active: i.get('active'),
          standard: i.get('standard'),
          label: i.get('label'),
          createdAt: i.get('createdAt'),
          updatedAt: i.get('updatedAt'),
        };
      }),
      totalRecords: listingInstance.totalRecords,
    });
  }
}
