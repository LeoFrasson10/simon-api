import { PrismaService } from '@shared/infra/db';
import { GetServiceClientById } from '../usecases';
import { ServiceClientRepository } from '@modules/service-client/infra';

export const makeGetServiceClientById = (): GetServiceClientById =>
  new GetServiceClientById(
    new ServiceClientRepository(PrismaService.getInstance()),
  );
