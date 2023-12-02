import { IIntegrationRepository } from '@modules/integrations/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  GetIntegrationUseCaseDTOInput,
  GetIntegrationUseCaseDTOOutput,
} from './dtos';

type Input = GetIntegrationUseCaseDTOInput;
type Output = GetIntegrationUseCaseDTOOutput;

export class GetIntegrationById implements IUseCase<Input, Result<Output>> {
  constructor(private readonly integrationRepository: IIntegrationRepository) {}

  public async execute({ integrationId }: Input): Promise<Result<Output>> {
    const integration = await this.integrationRepository.findIntegrationById(
      integrationId,
    );

    if (integration.isFail()) return Result.fail(integration.error());

    const integrationInstance = integration.value();

    return Result.Ok({
      id: integrationInstance.id.value(),
      name: integrationInstance.get('name'),
      email: integrationInstance.get('email'),
      origin: integrationInstance.get('origin'),
      createdAt: integrationInstance.get('createdAt'),
      updatedAt: integrationInstance.get('updatedAt'),
      autoApproved: integrationInstance.get('autoApproved'),
      fullAccess: integrationInstance.get('fullAccess'),
    });
  }
}
