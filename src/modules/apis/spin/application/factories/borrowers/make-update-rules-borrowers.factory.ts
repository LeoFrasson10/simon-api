import { UpdateRulesBorrowers } from '../../usecases';

export const makeUpdateRulesBorrower = (): UpdateRulesBorrowers =>
  new UpdateRulesBorrowers();
