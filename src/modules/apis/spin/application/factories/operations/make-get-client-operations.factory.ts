import { GetClientOperations } from '../../usecases';

export const makeGetClientOperations = (): GetClientOperations =>
  new GetClientOperations();
