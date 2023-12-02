import { IntegrationRepository } from '@modules/integrations/infra';
import { PrismaService } from '@shared/infra/db';
import { GetAllIntegrations } from '../usecases';

export const makeGetAllIntegrations = (): GetAllIntegrations =>
  new GetAllIntegrations(
    new IntegrationRepository(PrismaService.getInstance()),
  );
