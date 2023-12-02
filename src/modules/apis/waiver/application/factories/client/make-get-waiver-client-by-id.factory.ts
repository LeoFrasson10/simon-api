import { GetWaiverClientById } from '../../usecases';

export const makeGetWaiverClientById = (): GetWaiverClientById =>
  new GetWaiverClientById();
