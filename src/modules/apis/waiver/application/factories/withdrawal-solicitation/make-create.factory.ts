import { CreateWaiverWithdrawalSolicitation } from '../../usecases';

export const makeCreateWaiveWithdrawalSolicitation =
  (): CreateWaiverWithdrawalSolicitation =>
    new CreateWaiverWithdrawalSolicitation();
