import { GetWaiverClientByExtId } from '../../usecases';

export const makeGetWaiverClientByExtId = (): GetWaiverClientByExtId =>
  new GetWaiverClientByExtId();
