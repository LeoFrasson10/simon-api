import { UserRepository } from '@modules/user';
import { PrismaService } from '@shared/infra/db';
import { GetAllUsers } from '../usecases';

export const makeGetAllUsers = (): GetAllUsers =>
  new GetAllUsers(new UserRepository(PrismaService.getInstance()));
