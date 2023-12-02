import { EconomicGroupRepository } from '@modules/economic-group/infra';

import { PrismaService } from '@shared/infra/db';
import { GetAllEconomicGroups } from '../usecases';

export const makeGetAllEconomicGroups = (): GetAllEconomicGroups =>
  new GetAllEconomicGroups(
    new EconomicGroupRepository(PrismaService.getInstance()),
  );
