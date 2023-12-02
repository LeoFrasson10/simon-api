import { IUserRepository } from '@modules/user/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  FirstAccessUserUseCaseDTOInput,
  FirstAccessUserUseCaseDTOOutput,
} from './dtos';

type Input = FirstAccessUserUseCaseDTOInput;
type Output = FirstAccessUserUseCaseDTOOutput;

export class FirstAcessUser implements IUseCase<Input, Result<Output>> {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const user = await this.userRepository.findUserById(data.userId);

    if (user.isFail()) {
      return Result.fail('Usuário e/ou senha inválidos(s)');
    }

    const userInstance = user.value();

    if (!userInstance.get('firstAccess')) {
      return Result.fail('Usuário já fez o primeiro acesso!');
    }

    const verify = await userInstance.verifyPassword(data.oldPassword);

    if (verify.error()) {
      return Result.fail(verify.error());
    }

    const changePassword = await userInstance.changePassword(
      data.newPassword,
      data.repeatPassword,
    );

    if (changePassword.isFail()) {
      return Result.fail(changePassword.error());
    }

    userInstance.change('firstAccess', false);

    const userUpdated = await this.userRepository.update(userInstance);

    if (userUpdated.isFail()) return Result.fail(userUpdated.error());

    return Result.Ok({
      active: userInstance.get('active'),
      document: userInstance.get('document'),
      email: userInstance.get('email'),
      id: userInstance.id.value(),
      name: userInstance.get('name'),
      createdAt: userInstance.get('createdAt'),
    });
  }
}
