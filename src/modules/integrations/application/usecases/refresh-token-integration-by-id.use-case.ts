import { IIntegrationRepository } from '@modules/integrations/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  GetIntegrationUseCaseDTOInput,
  RefreshTokenIntegrationUseCaseDTOOutput,
} from './dtos';
import { generateJWTIntegration } from '@shared/helpers';
import { ICryptoProvider, IDateProvider } from '@shared/providers';

type Input = GetIntegrationUseCaseDTOInput;
type Output = RefreshTokenIntegrationUseCaseDTOOutput;

export class RefreshTokenIntegrationById
  implements IUseCase<Input, Result<Output>>
{
  constructor(
    private readonly integrationRepository: IIntegrationRepository,
    private readonly encryptation: ICryptoProvider,
    private readonly dateProvider: IDateProvider,
  ) {}

  public async execute({ integrationId }: Input): Promise<Result<Output>> {
    const integration = await this.integrationRepository.findIntegrationById(
      integrationId,
    );

    if (integration.isFail()) return Result.fail(integration.error());

    const integrationInstance = integration.value();

    const { token, expiresInMilliseconds } = generateJWTIntegration({
      integrationId: integrationInstance.id.value(),
    });

    const dueDate = this.dateProvider.addMillisecondsToDate({
      date: new Date(),
      amount: expiresInMilliseconds,
    });

    integrationInstance.change('dueDate', dueDate);

    const encryptedToken = await this.encryptation.privateEncryptData(
      Buffer.from(token).toString(),
    );

    if (!encryptedToken || encryptedToken.isFail()) {
      return Result.fail('Erro ao criptografar token');
    }

    // integrationInstance.change('key', encryptedToken.value());
    // integrationInstance.change('details', 'Refresh token');

    const saveLogToken = await this.integrationRepository.refreshToken(
      integrationInstance,
    );

    if (saveLogToken.isFail()) return Result.fail(saveLogToken.error());

    return Result.Ok({
      newToken: encryptedToken.value(),
    });
  }
}
