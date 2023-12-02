import { IntegrationRepository } from '@modules/integrations/infra';
import { PrismaService } from '@shared/infra/db';
import { GetIntegrationById } from '../usecases';

export const makeGetIntegrationById = (): GetIntegrationById =>
  new GetIntegrationById(
    new IntegrationRepository(PrismaService.getInstance()),
  );
