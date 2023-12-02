import { PrismaService } from '@shared/infra/db';
import { CreateServiceIntegration } from '../usecases';

import { ServiceIntegrationRepository } from '@modules/service-integration/infra';
import { IntegrationRepository } from '@modules/integrations';

export const makeCreateServiceIntegration = (): CreateServiceIntegration => {
  const orm = PrismaService.getInstance();

  return new CreateServiceIntegration(
    new ServiceIntegrationRepository(orm),
    new IntegrationRepository(orm),
  );
};
