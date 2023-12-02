import { PrismaService } from '@shared/infra/db';
import { GetServiceById } from '../usecases';
import { ServiceRepository } from '@modules/services/infra';

export const makeGetServiceById = (): GetServiceById =>
  new GetServiceById(new ServiceRepository(PrismaService.getInstance()));
