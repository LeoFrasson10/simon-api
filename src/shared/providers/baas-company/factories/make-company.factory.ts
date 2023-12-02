import { makeHttpClient } from '@shared/providers/http';
import { BaaS } from '../implementations';
import { IBaaS } from '../model';
import { IntegrationRepository } from '@modules/integrations';
import { PrismaService } from '@shared/infra/db';
import { MakeCryptoProvider } from '@shared/providers/encrypt';

export const makeCompany = (): IBaaS => {
  return new BaaS(
    makeHttpClient(),
    new IntegrationRepository(PrismaService.getInstance()),
    MakeCryptoProvider.getProvider(),
  );
};
