import { IntegrationRepository } from '@modules/integrations/infra';
import { PrismaService } from '@shared/infra/db';
import { CreateIntegration } from '../usecases';
import { MakeCryptoProvider, MakeDateProvider } from '@shared/providers';
import { ServiceRepository } from '@modules/services';

export const makeCreateIntegration = (): CreateIntegration => {
  const orm = PrismaService.getInstance();

  return new CreateIntegration(
    new IntegrationRepository(orm),
    MakeCryptoProvider.getProvider(),
    MakeDateProvider.getProvider(),
    new ServiceRepository(orm),
  );
};
