import { GetWaiverSolicitationById } from '../../usecases';

export const makeGetWaiverSolicitationById = (): GetWaiverSolicitationById =>
  new GetWaiverSolicitationById();
