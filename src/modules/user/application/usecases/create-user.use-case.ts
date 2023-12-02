import { IUserRepository, PermissionType, User } from '@modules/user/domain';
import { IUseCase, Result } from 'types-ddd';
import { CreateUserUseCaseDTOInput, CreateUserUseCaseDTOOutput } from './dtos';
import {
  isValidDocument,
  isValidEmail,
  isValidEnumValue,
  removeSpecialCharacters,
} from '@shared/helpers';
import { OrganizationEnum } from '@shared/utils';

type Input = CreateUserUseCaseDTOInput;
type Output = CreateUserUseCaseDTOOutput;

export class CreateUser implements IUseCase<Input, Result<Output>> {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const isValidInput = this.validateInput(data);
    if (isValidInput.isFail()) return Result.fail(isValidInput.error());

    const isExistsUser = await this.userRepository.findUserByEmail(data.email);

    if (isExistsUser.value()) {
      return Result.fail('E-mail já cadastrado');
    }
    const documentOnlyNumbers = removeSpecialCharacters(data.document);

    const newUser = User.create({
      document: documentOnlyNumbers,
      email: data.email,
      name: data.name,
      active: data.active ?? true,
      isAdmin: data.isAdmin ?? false,
      phone: data.phone,
      permission: PermissionType[data.permission] ?? PermissionType.read,
      organization: data.organization,
    });

    if (newUser.isFail()) {
      return Result.fail(newUser.error());
    }
    const userInstance = newUser.value();

    const createPassword = await userInstance.createTemporaryPassowrd();

    if (createPassword.isFail()) {
      return Result.fail(createPassword.error());
    }

    const user = await this.userRepository.createUser(newUser.value());

    if (user.isFail()) return Result.fail(user.error());

    return Result.Ok({
      user: {
        id: user.value().id,
        email: user.value().email,
        name: user.value().name,
      },
      temporaryPassword: createPassword.value(),
    });
  }

  private validateInput(data: Input): Result<void> {
    if (!data.name) return Result.fail('campo name requerido/inválido');

    if (!isValidEmail(data.email))
      return Result.fail('campo email requerido/inválido');

    if (!isValidEnumValue(OrganizationEnum, data.organization))
      return Result.fail('campo organization requerido/inválido');

    if (!data.document) return Result.fail('campo documento requerido');

    const documentOnlyNumbers = removeSpecialCharacters(data.document);

    const documentIsValid = isValidDocument(
      documentOnlyNumbers.length === 11 ? 'cpf' : 'cnpj',
      data.document,
    );

    if (!documentIsValid) {
      return Result.fail('Documento inválido');
    }

    return Result.Ok();
  }
}
