import { makeLois } from '@shared/providers';
import { UpdateAccountsBalances } from '../usecases';

export const makeUpdateAccountBalances = (): UpdateAccountsBalances =>
  new UpdateAccountsBalances(makeLois());
