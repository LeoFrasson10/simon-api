import { GetAcquiringReceivables } from '../../usecases';

export const makeGetAcquiringReceivables = (): GetAcquiringReceivables =>
  new GetAcquiringReceivables();
