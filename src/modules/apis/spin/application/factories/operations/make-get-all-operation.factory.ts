import { GetAllOperations } from '../../usecases';

export const makeGetAllOperations = (): GetAllOperations =>
  new GetAllOperations();
