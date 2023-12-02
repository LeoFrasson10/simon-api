import { PrismaService } from '@shared/infra/db';
import { GetClientById } from '../usecases';
import { ClientRepository } from '@modules/client/infra';

export const makeGetClientById = (): GetClientById =>
  new GetClientById(new ClientRepository(PrismaService.getInstance()));
