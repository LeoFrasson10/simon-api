import { GetWaiverBalancesByEconomicGroupId } from '../../usecases';

export const makeGetWaiverBalancesByEconomicGroup =
  (): GetWaiverBalancesByEconomicGroupId =>
    new GetWaiverBalancesByEconomicGroupId();
