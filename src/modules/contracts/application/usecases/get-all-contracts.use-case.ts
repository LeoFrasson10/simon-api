import { IUseCase, Result } from 'types-ddd';
import {
  ListContractsUseCaseDTOInput,
  ListContractsUseCaseDTOOutput,
} from './dtos';
import { IContractRepository } from '@modules/contracts/domain';

type Input = ListContractsUseCaseDTOInput;
type Output = ListContractsUseCaseDTOOutput;

export class GetAllContracts implements IUseCase<Input, Result<Output>> {
  constructor(private readonly contractRepository: IContractRepository) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const { filters, page, pageSize } = data;

    const listing = await this.contractRepository.list({
      page,
      pageSize,
      search: filters.search ?? undefined,
    });

    if (listing.isFail()) return Result.fail(listing.error());

    const listingInstance = listing.value();

    return Result.Ok({
      data: listingInstance.data.map((i) => {
        return {
          id: i.id.value(),
          title: i.get('title'),
          description: i.get('description'),
          version: i.get('version'),
          filename: i.get('filename'),
          createdAt: i.get('createdAt'),
          useSpreadsheet: i.get('useSpreadsheet'),
        };
      }),
      page,
      pageSize,
      totalRecords: listingInstance.totalRecords,
    });
  }
}
