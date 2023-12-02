import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';
import { GetSpinClientsUseCaseDTOInput } from './dtos';

type Input = GetSpinClientsUseCaseDTOInput;
type Output = any;

export class GetSpinAllClients implements IUseCase<Input, Result<Output>> {
  public async execute({
    filters: { name, page, pageSize },
    integrationId,
  }: Input): Promise<Result<Output>> {
    const clients = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/client`,
      method: 'get',
      module: 'spin',
      integrationId: integrationId,
      params: {
        page,
        pageSize,
        name,
      },
    });

    if (clients.isFail()) return Result.fail(clients.error());

    return Result.Ok(clients.value().response);
  }
}
