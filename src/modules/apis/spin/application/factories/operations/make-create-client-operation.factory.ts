import { CreateClientOperation } from '../../usecases';

export const makeCreateClientOperation = (): CreateClientOperation =>
  new CreateClientOperation();
