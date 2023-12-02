import { IUseCase, Result } from 'types-ddd';
import { GetBaaSPlansUseCaseDTOOutput } from './dtos';
import { makeCompany } from '@shared/providers';
type Input = any;
type Output = GetBaaSPlansUseCaseDTOOutput;

export class GetBaaSPlans implements IUseCase<Input, Result<Output>> {
  public async execute(): Promise<Result<Output>> {
    const listing = await makeCompany().listPlans();

    if (listing.isFail()) return Result.fail(listing.error());

    return Result.Ok({
      itens: listing.value().itens,
    });
  }
}
