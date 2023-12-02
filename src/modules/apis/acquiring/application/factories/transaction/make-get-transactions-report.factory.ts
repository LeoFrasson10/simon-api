import { GetAcquiringTransactionsReport } from '../../usecases';

export const makeGetAcquiringTransactionsReport =
  (): GetAcquiringTransactionsReport => new GetAcquiringTransactionsReport();
