import { PrismaService } from '@shared/infra/db';
import { GetStandardServices } from '../usecases';
import { ServiceRepository } from '@modules/services/infra';

export const makeGetStandardServices = (): GetStandardServices =>
  new GetStandardServices(new ServiceRepository(PrismaService.getInstance()));
