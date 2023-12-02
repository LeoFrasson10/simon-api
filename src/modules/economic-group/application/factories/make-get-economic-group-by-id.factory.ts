import { EconomicGroupRepository } from '@modules/economic-group/infra';
import { PrismaService } from '@shared/infra/db';
import { GetEconomicGroupById } from '../usecases';

export const makeGetEconomicGroupById = (): GetEconomicGroupById =>
  new GetEconomicGroupById(
    new EconomicGroupRepository(PrismaService.getInstance()),
  );
