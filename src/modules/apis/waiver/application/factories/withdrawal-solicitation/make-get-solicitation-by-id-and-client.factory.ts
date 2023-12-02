import { GetWaiverSolicitationByIdAndClient } from '../../usecases';

export const makeGetWaiverSolicitationByIdAndClient =
  (): GetWaiverSolicitationByIdAndClient =>
    new GetWaiverSolicitationByIdAndClient();
