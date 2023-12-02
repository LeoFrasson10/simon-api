import { makeLois } from '@shared/providers';
import { ListAccountsBalances } from '../usecases';

export const makeGetAccountBalances = (): ListAccountsBalances =>
  new ListAccountsBalances(makeLois());
