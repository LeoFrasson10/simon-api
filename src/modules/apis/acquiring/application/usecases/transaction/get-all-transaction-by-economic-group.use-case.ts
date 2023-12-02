import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';
import {
  Establishment,
  GetTransactionsByEconomicGroupUseCaseInput,
  GetTransactionsByEconomicGroupUseCaseOutput,
  GetTransactionsByEstablishmentIdsResponse,
} from './dtos';
import { IEconomicGroupRepository } from '@modules/economic-group';
import { IClientRepository } from '@modules/client';

type Input = GetTransactionsByEconomicGroupUseCaseInput;
type Output = GetTransactionsByEconomicGroupUseCaseOutput;

export class GetAcquiringAllTransactionByEconomicGroup
  implements IUseCase<Input, Result<Output>>
{
  constructor(
    private readonly economicGroupRepository: IEconomicGroupRepository,
    private readonly clientRepository: IClientRepository,
  ) {}

  public async execute(data: Input): Promise<Result<Output>> {
    if (!data.economicGroupId && !data.establishmentId) {
      return Result.fail('Informe 1 estabelecimento ou grupo econômico');
    }

    const establishments: Establishment[] = [];

    if (data.economicGroupId) {
      const economicGroup =
        await this.economicGroupRepository.findEconomicGroupById(
          data.economicGroupId,
        );

      if (economicGroup.isFail()) {
        return Result.fail(economicGroup.error());
      }

      const economicGroupInstance = economicGroup.value();

      const economicGroupClients = economicGroupInstance.get('clients');

      if (economicGroupClients.length === 0) {
        return Result.fail('Nenhum cliente vinculado ao grupo econômico');
      }

      establishments.push(
        ...economicGroupClients.map((egc) => ({
          establishmentId: egc.value().get('establishmentId'),
          name: egc.value().get('name'),
          document: egc.value().get('document'),
        })),
      );
    } else {
      const client = await this.clientRepository.findClientByEstablishmentId(
        data.establishmentId,
      );

      if (client.isFail()) return Result.fail(client.error());

      const clientInstance = client.value();

      establishments.push({
        document: clientInstance.get('document'),
        establishmentId: clientInstance.get('establishmentId'),
        name: clientInstance.get('name'),
      });
    }

    const acquiringResponse = await makeHttpClient().requestExternalModule<
      any,
      GetTransactionsByEstablishmentIdsResponse
    >({
      url: `${services.baseUrlAcquiring}/transactions/economic-group`,
      method: 'get',
      module: 'acquiring',
      params: {
        ...data,
        establishmentIds: establishments
          .map((i) => i.establishmentId)
          .join(','),
      },
    });

    if (acquiringResponse.isFail())
      return Result.fail(acquiringResponse.error());

    const acquiringData = acquiringResponse.value().response;

    return Result.Ok({
      data: acquiringData.data.map((i) => {
        const client = i.establishmentId
          ? establishments.find((e) => e.establishmentId === i.establishmentId)
          : null;

        return {
          ...i,
          name: client.name ?? null,
          document: client.document ?? null,
          totalBrute: i.credit.brute + i.debit.brute,
          totalLiquid: i.credit.liquid + i.debit.liquid,
        };
      }),
      totals: acquiringData.totals,
    });
  }
}
