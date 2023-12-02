import { UserRepository } from '@modules/user/infra';
import { PrismaService } from '@shared/infra/db';
import { GetUserMenuUseCase } from '../usecases';

export const makeGetUserMenuFactory = (): GetUserMenuUseCase =>
  new GetUserMenuUseCase(new UserRepository(PrismaService.getInstance()));
