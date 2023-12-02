import { makeLois } from '@shared/providers';
import { CreateLoisClients } from '../usecases';
import { ClientRepository } from '@modules/client';
import { PrismaService } from '@shared/infra/db';

export const makeCreateLoisClients = (): CreateLoisClients =>
  new CreateLoisClients(
    new ClientRepository(PrismaService.getInstance()),
    makeLois(),
  );
