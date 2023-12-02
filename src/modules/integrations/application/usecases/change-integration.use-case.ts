import { IIntegrationRepository } from '@modules/integrations/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  ChangeIntegrationUseCaseDTOInput,
  ChangeIntegrationUseCaseDTOOutput,
} from './dtos';

type Input = ChangeIntegrationUseCaseDTOInput;
type Output = ChangeIntegrationUseCaseDTOOutput;

export class ChangeIntegration implements IUseCase<Input, Result<Output>> {
  constructor(private readonly integrationRepository: IIntegrationRepository) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const integration = await this.integrationRepository.findIntegrationById(
      data.id,
    );

    if (integration.isFail()) {
      return Result.fail(integration.error());
    }
    const integrationInstance = integration.value();

    integrationInstance.update({
      ...data,
      id: integrationInstance.id,
      email: integrationInstance.get('email'),
    });

    const changedIntegration =
      await this.integrationRepository.updateIntegration(integrationInstance);

    if (changedIntegration.isFail())
      return Result.fail(changedIntegration.error());

    return Result.Ok({
      id: integrationInstance.id.value(),
    });
  }
}
