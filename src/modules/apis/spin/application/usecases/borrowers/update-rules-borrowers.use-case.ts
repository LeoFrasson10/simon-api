import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';
import { IUseCase, Result } from 'types-ddd';

type Input = {
  creditAnalyseId: string;
  integrationId: string;
  unstringifiedCSV: string[][];
};
type Output = any;

export class UpdateRulesBorrowers implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const response = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/borrower/rules/csv/${data.integrationId}`,
      method: 'put',
      body: {
        unstringifiedCSV: data.unstringifiedCSV,
        creditAnalyseId: data.creditAnalyseId,
      },
      module: 'spin',
      integrationId: data.integrationId,
    });

    if (response.isFail()) return Result.fail(response.error());

    return Result.Ok(response.value().response);
  }
}
