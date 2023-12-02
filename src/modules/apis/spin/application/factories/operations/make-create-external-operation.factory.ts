import { CreateOperationExternal } from '../../usecases';

export const makeCreateExternalOperation = (): CreateOperationExternal =>
  new CreateOperationExternal();
