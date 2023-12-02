import { calculator } from '@shared/config';
import { IHttpClient } from '@shared/providers/http';
import { Result } from 'types-ddd';
import { IFlowCalculator } from '../model';

import { CalculatorParams, CalculatorResponse } from './dtos';

export class FlowCalculator implements IFlowCalculator {
  private readonly baseUrl = calculator.baseUrl;
  private readonly xIntegrationKey = calculator.XIntegrationKey;

  constructor(private readonly httpClient: IHttpClient) {}

  public async calculateSimulation(
    data: CalculatorParams,
  ): Promise<Result<any>> {
    const amount = data.amount * 100;
    const interestRate = data.interestRate * 100;

    const calculateResponse = await this.httpClient.request<
      CalculatorParams,
      CalculatorResponse[]
    >({
      method: 'post',
      url: `${this.baseUrl}/proposal-calculator`,
      headers: {
        'X-Integration-Key': this.xIntegrationKey,
      },
      body: {
        amount,
        interestRate,
      },
    });

    if (calculateResponse.isFail())
      return Result.fail(calculateResponse.error());

    const response = calculateResponse.value().response;

    // const result = Object.keys(response).map((k) => response[k]);

    return Result.Ok(response);
  }
}
