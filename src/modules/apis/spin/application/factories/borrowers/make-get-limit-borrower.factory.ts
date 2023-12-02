import { GetLimitBorrower } from '../../usecases';

export const makeGetLimitBorrower = (): GetLimitBorrower =>
  new GetLimitBorrower();
