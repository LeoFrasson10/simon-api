import { GetAcquiringReceivablesByEconomicGroup } from '../../usecases';

export const makeGetAcquiringReceivablesEconomicGroup =
  (): GetAcquiringReceivablesByEconomicGroup =>
    new GetAcquiringReceivablesByEconomicGroup();
