import { UserRepository } from '@modules/user/infra';
import { PrismaService } from '@shared/infra/db';
import { VerifyUser } from '../usecases';

export const makeVerifyUser = (): VerifyUser =>
  new VerifyUser(new UserRepository(PrismaService.getInstance()));
