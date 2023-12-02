import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  clientId: string;
  integrationId: string;
};
type Output = {
  id: string;
  name: string;
  document: string;
  externalClientId: string;
  partnerName: string;
  partnerId: string;
};

export class GetSputnikSupplierByExternalId
  implements IUseCase<Input, Result<Output>>
{
  public async execute({
    integrationId,
    clientId,
  }: Input): Promise<Result<Output>> {
    const supplier = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSputnik}/supplier/external/${clientId}`,
      method: 'get',
      module: 'sputnik',
      integrationId,
    });

    if (supplier.isFail()) return Result.fail(supplier.error());

    return Result.Ok(supplier.value().response);
  }
}
