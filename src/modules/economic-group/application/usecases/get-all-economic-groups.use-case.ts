import { IEconomicGroupRepository } from '@modules/economic-group/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  ListEconomicGroupUseCaseDTOInput,
  ListEconomicGroupUseCaseDTOOutput,
} from './dtos';

type Input = ListEconomicGroupUseCaseDTOInput;
type Output = ListEconomicGroupUseCaseDTOOutput;

export class GetAllEconomicGroups implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly economicGroupRepository: IEconomicGroupRepository,
  ) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const { filters, page, pageSize } = data;

    const listing = await this.economicGroupRepository.listEconomicGroups({
      page,
      pageSize,
      active: filters.active ?? undefined,
      name: filters.name ?? undefined,
    });

    if (listing.isFail()) return Result.fail(listing.error());

    const listingInstance = listing.value();

    return Result.Ok({
      data: listingInstance.data.map((i) => {
        return {
          id: i.id.value(),
          name: i.get('name'),
          active: i.get('active'),
          updatedAt: i.get('updatedAt'),
          createdAt: i.get('createdAt'),
        };
      }),
      page,
      pageSize,
      totalRecords: listingInstance.totalRecords,
    });
  }
}
