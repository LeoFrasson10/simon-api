import { IUserRepository } from '@modules/user';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';
import { OrganizationEnum } from '@shared/utils';

import { IUseCase, Result } from 'types-ddd';

type Input = {
  userId: string;
};
type Output = any;

export class GetApolloOperationSupplierToFundClients
  implements IUseCase<Input, Result<Output>>
{
  constructor(private readonly userRepository: IUserRepository) {}
  public async execute(data: Input): Promise<Result<Output>> {
    const user = await this.userRepository.findUserById(data.userId);

    if (user.isFail()) return Result.fail(user.error());

    const userInstance = user.value();

    let organization = null;

    if (userInstance.get('organization')) {
      organization =
        userInstance.get('organization') === OrganizationEnum.flowbanco
          ? null
          : userInstance.get('organization');
    }

    const result = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlApollo}/operation/fund/list-operations`,
      method: 'get',
      module: 'apollo',
      params: {
        userId: data.userId,
        organization,
      },
      headers: {
        'user-adm-id': data.userId,
      },
    });

    if (result.isFail()) return Result.fail(result.error());

    return Result.Ok(result.value().response);
  }
}
