import { IntegrationRepository } from '@modules/integrations/infra';
import { PrismaService } from '@shared/infra/db';
import { RefreshTokenIntegrationById } from '../usecases';
import { MakeCryptoProvider, MakeDateProvider } from '@shared/providers';

export const makeRefreshIntegrationTokenById =
  (): RefreshTokenIntegrationById =>
    new RefreshTokenIntegrationById(
      new IntegrationRepository(PrismaService.getInstance()),
      MakeCryptoProvider.getProvider(),
      MakeDateProvider.getProvider(),
    );
