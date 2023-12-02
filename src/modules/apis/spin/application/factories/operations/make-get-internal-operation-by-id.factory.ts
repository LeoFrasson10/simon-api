import { GetInternalOperationById } from '../../usecases';

export const makeGetInternalOperationById = (): GetInternalOperationById =>
  new GetInternalOperationById();
