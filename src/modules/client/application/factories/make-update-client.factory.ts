import { ClientRepository } from '@modules/client/infra';
import { PrismaService } from '@shared/infra/db';
import { UpdateClient } from '../usecases';
import { EconomicGroupRepository } from '@modules/economic-group';

export const makeUpdateClient = (): UpdateClient => {
  const orm = PrismaService.getInstance();

  return new UpdateClient(
    new ClientRepository(orm),
    new EconomicGroupRepository(orm),
  );
};
