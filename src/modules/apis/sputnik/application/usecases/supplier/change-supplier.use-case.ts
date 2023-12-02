import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  sputnikSupplierId: string;
  externalClientId: string;
  integrationId: string;
};
type Output = void;

export class ChangeSputnikSupplier implements IUseCase<Input, Result<Output>> {
  public async execute({
    sputnikSupplierId,
    externalClientId,
    integrationId,
  }: Input): Promise<Result<Output>> {
    const supplier = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSputnik}/supplier/${sputnikSupplierId}`,
      method: 'put',
      module: 'sputnik',
      body: {
        externalClientId,
      },
      integrationId,
    });

    if (supplier.isFail()) return Result.fail(supplier.error());

    return Result.Ok(supplier.value().response);
  }
}
