import { CreateNewIndividualClientBaaS } from '../usecases/create-individual-client.use-case';
import { ClientRepository } from '@modules/client';
import { PrismaService } from '@shared/infra/db';

export const makeCreateIndividualClient = (): CreateNewIndividualClientBaaS =>
  new CreateNewIndividualClientBaaS(new ClientRepository(PrismaService.getInstance()));

