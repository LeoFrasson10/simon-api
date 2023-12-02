import { Result } from 'types-ddd';
import { CalculatorResponse, CalculatorParams } from '../implementations';

export type CalculateSimulationResponse = CalculatorResponse;

export interface IFlowCalculator {
  calculateSimulation(
    data: CalculatorParams,
  ): Promise<Result<CalculateSimulationResponse>>;
}
