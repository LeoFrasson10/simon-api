import { IUseCase, Result } from 'types-ddd';
import {
  GetBaaSCompanyUseCaseDTOInput,
  GetBaaSCompanyUseCaseDTOOutput,
} from './dtos';
import { makeCompany } from '@shared/providers';

type Input = GetBaaSCompanyUseCaseDTOInput;
type Output = GetBaaSCompanyUseCaseDTOOutput;

export class SearchBaaSCompany implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const listing = await makeCompany().searchCompany(data.search);

    if (listing.isFail()) return Result.fail(listing.error());

    return Result.Ok({
      data: listing.value().docs,
    });
  }
}
