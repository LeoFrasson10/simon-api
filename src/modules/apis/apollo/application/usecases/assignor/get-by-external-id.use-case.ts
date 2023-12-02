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
  ratingRuleId?: string;
  createdAt: string;
  monthlyInvoicing: number;
  monthlyInvoicingEstimated: number;
  monthlyInvoicingOnboarding: number;
  status: string;
  updatedAt: string;
  supplierId?: string;
  partnerName?: string;
};

export class GetApolloAssignorByExternalId
  implements IUseCase<Input, Result<Output>>
{
  public async execute({
    integrationId,
    clientId,
  }: Input): Promise<Result<Output>> {
    const assignor = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlApollo}/assignor/external/${clientId}`,
      method: 'get',
      module: 'apollo',
      integrationId,
    });

    if (assignor.isFail()) return Result.fail(assignor.error());

    return Result.Ok(assignor.value().response);
  }
}
