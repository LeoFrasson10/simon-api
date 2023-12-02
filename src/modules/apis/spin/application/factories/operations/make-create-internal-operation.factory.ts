import { CreateInternalOperation } from '../../usecases';

export const makeCreateInternalOperation = (): CreateInternalOperation =>
  new CreateInternalOperation();
