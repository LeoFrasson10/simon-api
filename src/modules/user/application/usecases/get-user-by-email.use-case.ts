import { IUserRepository } from '@modules/user/domain';

import { IUseCase, Result } from 'types-ddd';
import { GetUserUseCaseDTOInput, GetUserUseCaseDTOOutput } from './dtos';

type Input = GetUserUseCaseDTOInput;
type Output = GetUserUseCaseDTOOutput;

export class GetUserByEmail implements IUseCase<Input, Result<Output>> {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute({ email }: Input): Promise<Result<Output>> {
    const user = await this.userRepository.findUserByEmail(email);

    if (user.isFail()) return Result.fail(user.error());

    const userInstance = user.value();

    return Result.Ok({
      id: userInstance.id.value(),
      name: userInstance.get('name'),
      email: userInstance.get('email'),
      document: userInstance.get('document'),
      active: userInstance.get('active'),
      createdAt: userInstance.get('createdAt'),
      isAdmin: userInstance.get('isAdmin'),
      phone: userInstance.get('phone'),
      permission: userInstance.get('permission'),
    });
  }
}
