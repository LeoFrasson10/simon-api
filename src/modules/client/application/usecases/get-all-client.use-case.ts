import { IClientRepository } from '@modules/client/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  ListClientsUseCaseDTOInput,
  ListClientsUseCaseDTOOutput,
} from './dtos';
import { removeSpecialCharacters } from '@shared/helpers';

type Input = ListClientsUseCaseDTOInput;
type Output = ListClientsUseCaseDTOOutput;

export class GetAllClient implements IUseCase<Input, Result<Output>> {
  constructor(private readonly clientRepository: IClientRepository) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const { filters, page, pageSize } = data;

    const listing = await this.clientRepository.listClients({
      page,
      pageSize,
      document: filters.document
        ? removeSpecialCharacters(filters.document)
        : undefined,
      name: filters.name ?? undefined,
      onlyAcquiring: filters.onlyAcquiring ?? undefined,
      nameOrDocument: filters.nameOrDocument ?? undefined,
      approvedDateStart: filters.approvedDateStart
        ? new Date(filters.approvedDateStart)
        : undefined,
      approvedDateEnd: filters.approvedDateEnd
        ? new Date(filters.approvedDateEnd)
        : undefined,
    });

    if (listing.isFail()) return Result.fail(listing.error());

    const listingInstance = listing.value();

    return Result.Ok({
      data: listingInstance.data.map((i) => {
        const economicGroup = i.get('economicGroup')
          ? i.get('economicGroup').value()
          : null;

        return {
          id: i.id.value(),
          name: i.get('name'),
          document: i.get('document'),
          establishmentId: i.get('establishmentId'),
          email: i.get('email'),
          approvedDate: i.get('approvedDate') ?? null,
          economicGroup: economicGroup
            ? {
                id: economicGroup.id.value(),
                name: economicGroup.get('name'),
              }
            : null,

          createdAt: i.get('createdAt'),
          integrationName: i.get('integration').value().get('name'),
        };
      }),
      page,
      pageSize,
      totalRecords: listingInstance.totalRecords,
    });
  }
}
