import { GetAllOperationsByBorrower } from '../../usecases';

export const makeGetAllOperationsByBorrower = (): GetAllOperationsByBorrower =>
  new GetAllOperationsByBorrower();
