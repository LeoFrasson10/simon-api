import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  document: string;
  integrationId?: string;
};
type Output = {
  id: string;
  document: string;
  amountLimit: number;
  assignorId: string;
};

export class GetApolloSupplierByDocument
  implements IUseCase<Input, Result<Output>>
{
  public async execute({
    document,
    integrationId,
  }: Input): Promise<Result<Output>> {
    const supplier = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlApollo}/supplier/document/${document}`,
      method: 'get',
      module: 'apollo',
      params: {
        ...(integrationId
          ? {
              integrationId,
            }
          : null),
      },
    });

    if (supplier.isFail()) return Result.fail(supplier.error());

    return Result.Ok(supplier.value().response);
  }
}
