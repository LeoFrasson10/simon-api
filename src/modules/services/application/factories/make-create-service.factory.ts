import { PrismaService } from '@shared/infra/db';
import { CreateService } from '../usecases';
import { ServiceRepository } from '@modules/services/infra';

export const makeCreateService = (): CreateService =>
  new CreateService(new ServiceRepository(PrismaService.getInstance()));
