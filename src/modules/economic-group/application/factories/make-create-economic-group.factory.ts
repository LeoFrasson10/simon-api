import { EconomicGroupRepository } from '@modules/economic-group/infra';
import { PrismaService } from '@shared/infra/db';
import { CreateEconomicGroup } from '../usecases';

export const makeCreatEconomicGroup = (): CreateEconomicGroup =>
  new CreateEconomicGroup(
    new EconomicGroupRepository(PrismaService.getInstance()),
  );
