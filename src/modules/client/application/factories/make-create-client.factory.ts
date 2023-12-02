import { ClientRepository } from '@modules/client/infra';
import { PrismaService } from '@shared/infra/db';
import { CreateClient } from '../usecases';
import { makeLois } from '@shared/providers';

export const makeCreateClient = (): CreateClient =>
  new CreateClient(
    new ClientRepository(PrismaService.getInstance()),
    makeLois(),
  );
