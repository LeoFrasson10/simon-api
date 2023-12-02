import { UserRepository } from '@modules/user/infra';
import { PrismaService } from '@shared/infra/db';
import { CreateUser } from '../usecases';

export const makeCreateUser = (): CreateUser =>
  new CreateUser(new UserRepository(PrismaService.getInstance()));
