import { IUserRepository } from '@modules/user/domain';

import { IUseCase, Result } from 'types-ddd';
import { ListUsersUseCaseDTOInput, ListUsersUseCaseDTOOutput } from './dtos';
import { removeSpecialCharacters } from '@shared/helpers';

type Input = ListUsersUseCaseDTOInput;
type Output = ListUsersUseCaseDTOOutput;

export class GetAllUsers implements IUseCase<Input, Result<Output>> {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const { filters, page, pageSize } = data;

    const listing = await this.userRepository.listUsers({
      page,
      pageSize,
      active: filters.active ?? undefined,
      document: filters.document
        ? removeSpecialCharacters(filters.document)
        : undefined,
      name: filters.name ?? undefined,
    });

    if (listing.isFail()) return Result.fail(listing.error());

    const listingInstance = listing.value();

    return Result.Ok({
      data: listingInstance.data.map((i) => {
        return {
          id: i.get('id').value(),
          name: i.get('name'),
          document: i.get('document'),
          active: i.get('active'),
          createdAt: i.get('createdAt'),
          email: i.get('email'),
          isAdmin: i.get('isAdmin'),
          phone: i.get('phone'),
          permission: i.get('permission'),
          organization: i.get('organization'),
        };
      }),
      page,
      pageSize,
      totalRecords: listingInstance.totalRecords,
    });
  }
}
