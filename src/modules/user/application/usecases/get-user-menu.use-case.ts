import { IUseCase, Result } from 'types-ddd';
import {
  GetUserMenuUseCaseDtoInput,
  GetUserMenuUseCaseDtoOutput,
} from './dtos';
import { IUserRepository } from '@modules/user/domain';

type Input = GetUserMenuUseCaseDtoInput;
type Output = GetUserMenuUseCaseDtoOutput;

export class GetUserMenuUseCase implements IUseCase<Input, Result<Output>> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({ id }: Input): Promise<Result<Output>> {
    const user = await this.userRepository.findUserById(id);

    if (user.isFail()) return Result.fail(user.error());

    const menu = user.value().getUserMenu();

    return Result.Ok(menu.value());
  }
}
