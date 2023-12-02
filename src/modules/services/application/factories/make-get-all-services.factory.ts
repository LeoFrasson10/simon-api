import { PrismaService } from '@shared/infra/db';
import { GetAllServices } from '../usecases';
import { ServiceRepository } from '@modules/services/infra';

export const makeGetAllServices = (): GetAllServices =>
  new GetAllServices(new ServiceRepository(PrismaService.getInstance()));
