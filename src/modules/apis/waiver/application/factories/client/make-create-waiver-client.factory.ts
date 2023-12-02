import { CreateWaiverClient } from '../../usecases';

export const makeCreateWaiverClient = (): CreateWaiverClient =>
  new CreateWaiverClient();
