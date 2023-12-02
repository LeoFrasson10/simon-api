import { PrismaService } from '@shared/infra/db';
import { GetServicesByKeys } from '../usecases';
import { ServiceRepository } from '@modules/services/infra';

export const makeGetServicesByKeys = (): GetServicesByKeys =>
  new GetServicesByKeys(new ServiceRepository(PrismaService.getInstance()));
