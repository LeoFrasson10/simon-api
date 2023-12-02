import { UserRepository } from '@modules/user/infra';
import { PrismaService } from '@shared/infra/db';
import { GetUserByEmail } from '../usecases';

export const makeGetUserByEmail = (): GetUserByEmail =>
  new GetUserByEmail(new UserRepository(PrismaService.getInstance()));
