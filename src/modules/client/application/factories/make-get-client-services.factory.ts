import { PrismaService } from '@shared/infra/db';
import { GetClientServices } from '../usecases';
import { ClientRepository } from '@modules/client/infra';
import { ServiceRepository } from '@modules/services';

export const makeGetClientServices = (): GetClientServices => {
  const orm = PrismaService.getInstance();
  return new GetClientServices(
    new ClientRepository(orm),
    new ServiceRepository(orm),
  );
};
