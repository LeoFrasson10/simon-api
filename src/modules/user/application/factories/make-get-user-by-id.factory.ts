import { UserRepository } from '@modules/user/infra';
import { PrismaService } from '@shared/infra/db';
import { GetUserById } from '../usecases';

export const makeGetUserById = (): GetUserById =>
  new GetUserById(new UserRepository(PrismaService.getInstance()));
