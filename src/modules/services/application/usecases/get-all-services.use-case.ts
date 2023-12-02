import { IServiceRepository } from '@modules/services/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  ListServicesUseCaseDTOInput,
  ListServicesUseCaseDTOOutput,
} from './dtos';

type Input = ListServicesUseCaseDTOInput;
type Output = ListServicesUseCaseDTOOutput;

export class GetAllServices implements IUseCase<Input, Result<Output>> {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const { filters, page, pageSize } = data;

    const listing = await this.serviceRepository.getAllServices({
      page,
      pageSize,
      name: filters.name ?? undefined,
      keys: filters.keys ?? undefined,
    });

    if (listing.isFail()) return Result.fail(listing.error());

    const listingInstance = listing.value();

    return Result.Ok({
      data: listingInstance.data.map((i) => {
        return {
          id: i.id.value(),
          name: i.get('name'),
          key: i.get('key'),
          active: i.get('active'),
          label: i.get('label'),
          standard: i.get('standard'),
          createdAt: i.get('createdAt'),
          updatedAt: i.get('updatedAt'),
        };
      }),
      page,
      pageSize,
      totalRecords: listingInstance.totalRecords,
    });
  }
}
