import { PrismaService } from '@shared/infra/db';
import { CreateNewClientByBaaS } from '../usecases';
import { ClientRepository } from '@modules/client/infra';

export const makeCreateNewClient = (): CreateNewClientByBaaS =>
  new CreateNewClientByBaaS(new ClientRepository(PrismaService.getInstance()));
