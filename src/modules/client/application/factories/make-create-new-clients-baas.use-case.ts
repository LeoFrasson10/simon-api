import { ClientRepository } from '@modules/client/infra';
import { PrismaService } from '@shared/infra/db';
import { CreateNewClientsBaaS } from '../usecases';

export const makeCreateNewClientsBaaS = (): CreateNewClientsBaaS =>
  new CreateNewClientsBaaS(new ClientRepository(PrismaService.getInstance()));
