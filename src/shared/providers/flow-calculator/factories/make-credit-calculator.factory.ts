import { makeHttpClient } from '@shared/providers/http';
import { FlowCalculator } from '../implementations';
import { IFlowCalculator } from '../model';

export const makeCreditCalculator = (): IFlowCalculator => {
  return new FlowCalculator(makeHttpClient());
};
