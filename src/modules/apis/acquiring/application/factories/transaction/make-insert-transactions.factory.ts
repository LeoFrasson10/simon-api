import { InsertTransactionsByMonth } from '../../usecases';

export const makeInsertTransactionsByMonth = (): InsertTransactionsByMonth =>
  new InsertTransactionsByMonth();
