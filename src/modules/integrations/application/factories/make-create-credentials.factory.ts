import { IntegrationRepository } from '@modules/integrations/infra';
import { PrismaService } from '@shared/infra/db';
import { CreateCredentials } from '../usecases';
import { MakeCryptoProvider } from '@shared/providers';

export const makeCreateCredentials = (): CreateCredentials =>
  new CreateCredentials(
    new IntegrationRepository(PrismaService.getInstance()),
    MakeCryptoProvider.getProvider(),
  );
