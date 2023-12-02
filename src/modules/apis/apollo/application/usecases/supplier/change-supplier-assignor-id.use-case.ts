import { services } from '@shared/config';
import { Modules, makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  supplierId: string;
  assignorId: string;
};
type Output = any;

export class ChangeApolloSupplierAssignor
  implements IUseCase<Input, Result<Output>>
{
  private baseUrl = services.baseUrlApollo;
  private module: Modules = 'apollo';
  private prefix = 'supplier';

  public async execute({
    assignorId,
    supplierId,
  }: Input): Promise<Result<Output>> {
    const result = await makeHttpClient().requestExternalModule({
      url: `${this.baseUrl}/${this.prefix}/change-supplier-assignor/${supplierId}`,
      method: 'put',
      module: this.module,
      body: {
        assignorId,
      },
    });

    if (result.isFail()) return Result.fail(result.error());

    return Result.Ok(result.value().response);
  }
}
