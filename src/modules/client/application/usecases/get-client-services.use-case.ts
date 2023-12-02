import { IClientRepository } from '@modules/client/domain';
import { IUseCase, Result } from 'types-ddd';
import {
  GetClientServicesUseCaseDTOInput,
  GetClientServicesUseCaseDTOOutput,
  ActionsType,
} from './dtos';
import { IServiceRepository } from '@modules/services';
import { makeGetApolloAssignorByExternalId } from '@modules/apis';
import { makeGetSputnikSupplierByExternalId } from '@modules/apis/sputnik/application';

type Input = GetClientServicesUseCaseDTOInput;
type Output = GetClientServicesUseCaseDTOOutput;

export class GetClientServices implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly serviceRepository: IServiceRepository,
  ) {}

  public async execute({ clientId }: Input): Promise<Result<Output>> {
    const client = await this.clientRepository.findClientById(clientId);

    if (client.isFail()) return Result.fail(client.error());

    const listServices = await this.serviceRepository.getAllServices({});

    if (listServices.isFail()) {
      return Result.fail(listServices.error());
    }

    const clientInstance = client.value();
    const services = listServices.value().data;
    const integration = clientInstance.get('integration').value();
    const clientService = clientInstance.get('serviceClient').value();

    const matchServices: ActionsType[] = [];

    for (const s of services) {
      const hasPermission = clientService.get('keys').includes(s.get('key'));
      const obj: ActionsType = {
        isActive: hasPermission,
        label: s.get('label'),
        key: s.get('key'),
      };

      if (integration.get('fullAccess')) {
        matchServices.push(obj);
      } else if (
        integration.get('integrationService') &&
        integration.get('integrationService').length > 0
      ) {
        const lastService = integration.getLastService();
        if (lastService.isOk()) {
          const findService = lastService
            .value()
            .get('serviceIds')
            .find((i) => i === s.id.value());

          if (findService) {
            matchServices.push(obj);
          }
        }
      }
    }

    const assignor = await makeGetApolloAssignorByExternalId().execute({
      clientId,
      integrationId: clientInstance.get('integrationId').value(),
    });

    if (assignor.value() && assignor.value().supplierId) {
      matchServices.push({
        isActive: true,
        label: `${
          assignor.value().partnerName
            ? `Fornecedor ${assignor.value().partnerName}`
            : 'Antecipação a Fornecedor'
        }`,
        key: 'operation_supplier',
      });
    }

    const supplier = await makeGetSputnikSupplierByExternalId().execute({
      clientId,
      integrationId: clientInstance.get('integrationId').value(),
    });
    if (supplier.value()) {
      matchServices.push({
        isActive: true,
        label: `${
          supplier.value().partnerName
            ? `Fornecedor ${supplier.value().partnerName}`
            : 'Antecipação a Fornecedor'
        }`,
        key: 'sputnik_operation_supplier',
      });
    }

    return Result.Ok({
      actions: matchServices,
    });
  }
}
