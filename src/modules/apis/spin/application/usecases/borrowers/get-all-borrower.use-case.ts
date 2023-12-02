import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';
import { GetBorrowersUseCaseDTOInput } from './dtos';

type Input = GetBorrowersUseCaseDTOInput;
type Output = any;

export class GetAllBorrower implements IUseCase<Input, Result<Output>> {
  public async execute({
    integrationId,
    filters: { name, page, pageSize },
  }: Input): Promise<Result<Output>> {
    const borrowers = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/borrower`,
      method: 'get',
      module: 'spin',
      integrationId,
      params: {
        page,
        pageSize,
        name,
      },
    });

    if (borrowers.isFail()) return Result.fail(borrowers.error());

    return Result.Ok(borrowers.value().response);
  }
}
