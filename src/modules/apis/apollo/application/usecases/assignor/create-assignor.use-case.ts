import { CreateApolloAssignorDTORequest } from '@modules/apis/apollo/infra/api/dtos';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';

type Input = CreateApolloAssignorDTORequest;
type Output = any;

export class CreateApolloAssignor implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const createAssignor = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlApollo}/assignor`,
      method: 'post',
      body: data,
      module: 'apollo',
    });

    if (createAssignor.isFail()) return Result.fail(createAssignor.error());

    return Result.Ok(createAssignor.value().response);
  }
}
