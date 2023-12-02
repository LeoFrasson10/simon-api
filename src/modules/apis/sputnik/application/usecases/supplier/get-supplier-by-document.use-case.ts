import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  document: string;
  integrationId?: string;
};
type Output = {
  id: string;
  externalClientId: string;
  document: string;
};

export class GetSputnikSupplierByDocument
  implements IUseCase<Input, Result<Output>>
{
  public async execute({
    document,
    integrationId,
  }: Input): Promise<Result<Output>> {
    const supplier = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSputnik}/supplier/document/${document}`,
      method: 'get',
      module: 'sputnik',
      params: {
        integrationId,
      },
    });

    if (supplier.isFail()) return Result.fail(supplier.error());

    return Result.Ok(supplier.value().response);
  }
}
