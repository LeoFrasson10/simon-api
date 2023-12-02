import { UpdateStatusOperations } from '../../usecases';

export const makeUpdateStatusOperations = (): UpdateStatusOperations =>
  new UpdateStatusOperations();
