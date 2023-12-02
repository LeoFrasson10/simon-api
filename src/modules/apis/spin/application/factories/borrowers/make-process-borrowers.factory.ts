import { ProcessBorrowers } from '../../usecases';

export const makeProcessBorrowers = (): ProcessBorrowers =>
  new ProcessBorrowers();
