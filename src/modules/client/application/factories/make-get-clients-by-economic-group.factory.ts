import { PrismaService } from '@shared/infra/db';
import { GetClientsByEconomicGroup } from '../usecases';
import { ClientRepository } from '@modules/client/infra';

export const makeGetClientsByEconomicGroup = (): GetClientsByEconomicGroup =>
  new GetClientsByEconomicGroup(
    new ClientRepository(PrismaService.getInstance()),
  );
