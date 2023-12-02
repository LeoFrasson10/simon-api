import { IIntegrationRepository } from '@modules/integrations/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  ListIntegrationsUseCaseDTOInput,
  ListIntegrationsUseCaseDTOOutput,
} from './dtos';

type Input = ListIntegrationsUseCaseDTOInput;
type Output = ListIntegrationsUseCaseDTOOutput;

export class GetAllIntegrations implements IUseCase<Input, Result<Output>> {
  constructor(private readonly integrationRepository: IIntegrationRepository) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const { filters, page, pageSize } = data;

    const listing = await this.integrationRepository.listIntegrations({
      page,
      pageSize,
      name: filters.name ?? undefined,
    });

    if (listing.isFail()) return Result.fail(listing.error());

    const listingInstance = listing.value();

    return Result.Ok({
      data: listingInstance.data.map((i) => {
        return {
          id: i.get('id').value(),
          name: i.get('name'),
          email: i.get('email'),
          autoApproved: i.get('autoApproved'),
          active: i.get('active'),
          dueDate: i.get('dueDate'),
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
