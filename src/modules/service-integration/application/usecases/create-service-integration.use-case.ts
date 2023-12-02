import { IUseCase, Result } from 'types-ddd';

import {
  IServiceIntegrationRepository,
  ServiceIntegration,
} from '@modules/service-integration/domain';
import { IIntegrationRepository } from '@modules/integrations';
import {
  CreateServiceIntegrationUseCaseDTOInput,
  CreateServiceIntegrationUseCaseDTOOutput,
} from './dtos';

type Input = CreateServiceIntegrationUseCaseDTOInput;
type Output = CreateServiceIntegrationUseCaseDTOOutput;

export class CreateServiceIntegration
  implements IUseCase<Input, Result<Output>>
{
  constructor(
    private readonly serviceClientRepository: IServiceIntegrationRepository,
    private readonly integrationRepository: IIntegrationRepository,
  ) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const integration = await this.integrationRepository.findIntegrationById(
      data.integrationId,
    );

    if (integration.isFail()) return Result.fail(integration.error());

    const integrationInstance = integration.value();

    const newServiceIntegration = ServiceIntegration.create({
      integrationId: integrationInstance.id,
      serviceIds: data.servicesIds,
    });

    if (newServiceIntegration.isFail())
      return Result.fail(newServiceIntegration.error());

    const service = await this.serviceClientRepository.createServiceIntegration(
      newServiceIntegration.value(),
    );

    if (service.isFail()) return Result.fail(service.error());

    return Result.Ok(service.value());
  }
}
