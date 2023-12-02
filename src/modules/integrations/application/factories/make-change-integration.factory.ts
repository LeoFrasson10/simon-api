import { IntegrationRepository } from '@modules/integrations/infra';
import { PrismaService } from '@shared/infra/db';
import { ChangeIntegration } from '../usecases';

export const makeChangeIntegration = (): ChangeIntegration =>
  new ChangeIntegration(new IntegrationRepository(PrismaService.getInstance()));
