import { GetSpinAllClients } from '../../usecases';

export const makeGetSpinAllClients = (): GetSpinAllClients =>
  new GetSpinAllClients();
