import { PrismaService } from '@shared/infra/db';
import { GetAllClient } from '../usecases';
import { ClientRepository } from '@modules/client/infra';

export const makeGetAllClients = (): GetAllClient =>
  new GetAllClient(new ClientRepository(PrismaService.getInstance()));
