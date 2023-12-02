import { ClientRepository } from '@modules/client/infra';
import { PrismaService } from '@shared/infra/db';
import { GetUserByDocument } from '../usecases';

export const makeGetClientByDocument = (): GetUserByDocument =>
  new GetUserByDocument(new ClientRepository(PrismaService.getInstance()));
