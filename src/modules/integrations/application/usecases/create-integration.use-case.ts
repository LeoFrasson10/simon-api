import {
  IIntegrationRepository,
  Integration,
} from '@modules/integrations/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  CreateIntegrationUseCaseDTOInput,
  CreateIntegrationUseCaseDTOOutput,
} from './dtos';
import {
  ICryptoProvider,
  IDateProvider,
  MakeCryptoProvider,
} from '@shared/providers';
import { generateJWTIntegration } from '@shared/helpers';
import { IServiceRepository } from '@modules/services';

type Input = CreateIntegrationUseCaseDTOInput;
type Output = CreateIntegrationUseCaseDTOOutput;

export class CreateIntegration implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly integrationRepository: IIntegrationRepository,
    private readonly encryptation: ICryptoProvider,
    private readonly dateProvider: IDateProvider,
    private readonly serviceRepository: IServiceRepository,
  ) {
    this.encryptation = MakeCryptoProvider.getProvider();
  }

  public async execute(data: Input): Promise<Result<Output>> {
    const integration = await this.integrationRepository.findIntegrationByEmail(
      data.email,
    );

    if (integration.value()) {
      return Result.fail('E-mail já cadastrado');
    }

    // if (data.servicesId.length > 0) {
    //   for await (const serviceId of data.servicesId) {
    //     const service = await this.serviceRepository.findServiceById(serviceId);

    //     if (service.isFail()) {
    //       return Result.fail(service.error());
    //     }
    //   }
    // }

    const newIntegration = Integration.create({
      email: data.email,
      name: data.name,
      active: data.active ?? true,
      autoApproved: data.autoApproved,
      document: data.document,
      origin: data.origin,
      details: 'Nova integração',
      fullAccess: data.fullAccess,
    });

    if (newIntegration.isFail()) return Result.fail(newIntegration.error());

    const integrationInstance = newIntegration.value();

    const { token, expiresInMilliseconds } = generateJWTIntegration({
      integrationId: integrationInstance.id.value(),
    });

    const dueDate = this.dateProvider.addMillisecondsToDate({
      date: new Date(),
      amount: expiresInMilliseconds,
    });

    integrationInstance.change('dueDate', dueDate);

    if (data.credentials) {
      const credentialsToEncrypt = JSON.stringify(data.credentials);

      const [encryptedToken, encryptedData] = await Promise.all([
        this.encryptation.privateEncryptData(Buffer.from(token).toString()),
        this.encryptation.privateEncryptData(credentialsToEncrypt),
      ]);

      if (!encryptedData || !encryptedToken) {
        return Result.fail('Erro ao criptografar dados');
      }

      if (encryptedData && encryptedData.isFail()) {
        return Result.fail(encryptedData.error());
      }

      if (encryptedToken && encryptedToken.isFail()) {
        return Result.fail(encryptedToken.error());
      }

      integrationInstance.change('credentials', encryptedData.value());
      integrationInstance.change('key', encryptedToken.value());
    }

    const createdIntegration =
      await this.integrationRepository.createIntegration(integrationInstance);

    if (createdIntegration.isFail())
      return Result.fail(createdIntegration.error());

    return Result.Ok({
      id: integrationInstance.id.value(),
      token: integrationInstance.get('key'),
    });
  }
}
