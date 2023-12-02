import { GetWaiverAllSolicitations } from '../../usecases';

export const makeGetWaiverAllSolicitation = (): GetWaiverAllSolicitations =>
  new GetWaiverAllSolicitations();
