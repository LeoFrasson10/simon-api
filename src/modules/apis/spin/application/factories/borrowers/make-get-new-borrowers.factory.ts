import { GetNewsBorrowers } from '../../usecases';

export const makeGetNewsBorrowers = (): GetNewsBorrowers =>
  new GetNewsBorrowers();
