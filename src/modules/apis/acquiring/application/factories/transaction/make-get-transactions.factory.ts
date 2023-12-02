import { GetAcquiringAllTransaction } from '../../usecases';

export const makeGetAcquiringAllTransaction = (): GetAcquiringAllTransaction =>
  new GetAcquiringAllTransaction();
