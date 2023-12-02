import { UserRepository } from '@modules/user';
import { PrismaService } from '@shared/infra/db';
import { FirstAcessUser } from '../usecases';

export const makeFirstAccess = (): FirstAcessUser =>
  new FirstAcessUser(new UserRepository(PrismaService.getInstance()));
