import { GetSpinClientByIntegration } from '../../usecases';

export const makeGetSpinClientByIntegration = (): GetSpinClientByIntegration =>
  new GetSpinClientByIntegration();
