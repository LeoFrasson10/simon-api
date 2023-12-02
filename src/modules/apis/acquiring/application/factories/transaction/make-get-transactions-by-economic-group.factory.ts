import { EconomicGroupRepository } from '@modules/economic-group';
import { GetAcquiringAllTransactionByEconomicGroup } from '../../usecases';
import { PrismaService } from '@shared/infra/db';
import { ClientRepository } from '@modules/client';

export const makeGetAcquiringAllTransactionByEconomicGRoup =
  (): GetAcquiringAllTransactionByEconomicGroup => {
    const orm = PrismaService.getInstance();

    return new GetAcquiringAllTransactionByEconomicGroup(
      new EconomicGroupRepository(orm),
      new ClientRepository(orm),
    );
  };
