import { IIntegrationRepository } from '@modules/integrations/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  CreateCredentialsUseCaseDTOInput,
  CreateCredentialsUseCaseDTOOutput,
} from './dtos';
import { ICryptoProvider, MakeCryptoProvider } from '@shared/providers';

type Input = CreateCredentialsUseCaseDTOInput;
type Output = CreateCredentialsUseCaseDTOOutput;

export class CreateCredentials implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly integrationRepository: IIntegrationRepository,
    private readonly encryptation: ICryptoProvider,
  ) {
    this.encryptation = MakeCryptoProvider.getProvider();
  }

  public async execute(data: Input): Promise<Result<Output>> {
    const integration = await this.integrationRepository.findIntegrationById(
      data.integrationId,
    );

    if (integration.isFail()) {
      return Result.fail(integration.error());
    }

    const integrationInstance = integration.value();

    if (integrationInstance.get('credentials')) {
      return Result.fail('Integração já possui credenciais cadastrada!');
    }

    const credentialsToEncrypt = JSON.stringify(data);

    const encryptedData = await this.encryptation.privateEncryptData(
      credentialsToEncrypt,
    );

    if (!encryptedData) {
      return Result.fail('Erro ao criptografar dados');
    }

    if (encryptedData && encryptedData.isFail()) {
      return Result.fail(encryptedData.error());
    }

    integrationInstance.change('credentials', encryptedData.value());

    const createdIntegration =
      await this.integrationRepository.updateIntegration(integrationInstance);

    if (createdIntegration.isFail())
      return Result.fail(createdIntegration.error());

    return Result.Ok({
      id: integrationInstance.id.value(),
    });
  }
}
