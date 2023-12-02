import { CreateWaiverBalance } from '../../usecases';

export const makeCreateWaiverBalance = (): CreateWaiverBalance =>
  new CreateWaiverBalance();
