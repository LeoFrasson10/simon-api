import { GetWaiverAllClient } from '../../usecases';

export const makeGetWaiverAllClient = (): GetWaiverAllClient =>
  new GetWaiverAllClient();
