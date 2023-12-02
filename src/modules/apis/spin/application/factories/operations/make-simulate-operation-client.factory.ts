import { SimulateOperationClient } from '../../usecases';

export const makeSimulateOperationClient = (): SimulateOperationClient =>
  new SimulateOperationClient();
