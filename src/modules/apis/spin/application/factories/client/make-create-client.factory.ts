import { CreateSpinClient } from '../../usecases';

export const makeCreateSpinClient = (): CreateSpinClient =>
  new CreateSpinClient();
