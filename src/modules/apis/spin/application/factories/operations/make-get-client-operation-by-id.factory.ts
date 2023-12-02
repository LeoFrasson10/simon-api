import { GetClientOperationById } from '../../usecases';

export const makeGetClientOperationById = (): GetClientOperationById =>
  new GetClientOperationById();
