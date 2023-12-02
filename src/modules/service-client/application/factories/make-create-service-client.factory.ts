import { PrismaService } from '@shared/infra/db';
import { CreateServiceClient } from '../usecases';
import { ServiceClientRepository } from '@modules/service-client/infra';

export const makeCreateServiceClient = (): CreateServiceClient =>
  new CreateServiceClient(
    new ServiceClientRepository(PrismaService.getInstance()),
  );
