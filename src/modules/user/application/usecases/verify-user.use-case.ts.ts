import { IUserRepository } from '@modules/user/domain';

import { IUseCase, Result } from 'types-ddd';
import { GetUserUseCaseDTOInput, GetUserUseCaseDTOOutput } from './dtos';

type Input = GetUserUseCaseDTOInput;
type Output = GetUserUseCaseDTOOutput;

export class VerifyUser implements IUseCase<Input, Result<Output>> {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const user = await this.userRepository.findUserByEmail(data.email);

    if (user.isFail()) {
      return Result.fail('Usuário e/ou senha inválidos(s)');
    }

    const isValidPassword = await user.value().verifyPassword(data.password);

    if (isValidPassword.error()) {
      return Result.fail('Usuário e/ou senha inválidos(s)');
    }

    const userLogged = await this.userRepository.findUserById(
      user.value().id.value(),
    );

    const userInstance = userLogged.value();

    return Result.Ok({
      active: userInstance.get('active'),
      document: userInstance.get('document'),
      email: userInstance.get('email'),
      id: userInstance.id.value(),
      name: userInstance.get('name'),
      isAdmin: userInstance.get('isAdmin'),
      phone: userInstance.get('phone'),
      createdAt: userInstance.get('createdAt'),
      permission: userInstance.get('permission'),
    });
  }
}
