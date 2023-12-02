import {
  StrengthPassword,
  checkPasswordStrength,
  isValidDocument,
} from '@shared/helpers';
import {
  IEncryptationProvider,
  MakeEncryptationProvider,
} from '@shared/providers';
import { DefaultAggregateProps } from '@shared/types';
import { Aggregate, Result } from 'types-ddd';

import { UserMenu, menuInterfaces } from '@shared/config/permission';
import { OrganizationEnum } from '@shared/utils';

export enum PermissionType {
  admin = 'admin',
  read = 'read',
  backoffice = 'backoffice',
  manager = 'manager',
}
type UserProps = DefaultAggregateProps & {
  name: string;
  email: string;
  password?: string;
  document: string;
  active?: boolean;
  isAdmin: boolean;
  phone?: string;
  firstAccess?: boolean;
  permission?: PermissionType;
  organization?: OrganizationEnum;
};

export class User extends Aggregate<UserProps> {
  private encryptation: IEncryptationProvider;

  constructor(props: UserProps) {
    super(props);
    this.encryptation = MakeEncryptationProvider.getProvider();
  }

  public isActive(): Result<void> {
    if (!this.get('active')) return Result.fail('Usuário não ativado');

    return Result.Ok();
  }

  public static isValid({
    name,
    email,
    document,
    permission,
  }: UserProps): Result<void> {
    const { string } = this.validator;

    if (string(name).isEmpty()) {
      return Result.fail('Nome é obrigatório');
    }

    if (string(email).isEmpty()) {
      return Result.fail('Email é obrigatório');
    }

    if (string(document).isEmpty()) {
      return Result.fail('CPF/CNPJ é obrigatório');
    }

    if (!isValidDocument(document.length === 11 ? 'cpf' : 'cnpj', document)) {
      return Result.fail('CPF/CNPJ inválido');
    }

    if (!Object.values(PermissionType).includes(permission)) {
      return Result.fail('permission inválido');
    }

    return Result.Ok();
  }

  public static create(props: UserProps): Result<User> {
    const isValid = User.isValid(props);

    if (isValid.isFail()) return Result.fail(isValid.error());

    return Result.Ok(new User(props));
  }

  public async createTemporaryPassowrd(): Promise<Result<string>> {
    try {
      const randomPassword = Math.random().toString(36).slice(-8);

      const hashPassword = await this.encryptation.generateHash(randomPassword);

      this.change('password', hashPassword);

      return Result.Ok(randomPassword);
    } catch {
      return Result.fail('Ocorreu um erro ao criar senha temporária');
    }
  }

  public async createPassowrd(password: string): Promise<Result<void>> {
    try {
      const hashPassword = await this.encryptation.generateHash(password);

      this.change('password', hashPassword);

      return Result.Ok();
    } catch (error) {
      console.log(error);
      return Result.fail('Ocorreu um erro ao criar senha');
    }
  }

  public async verifyPassword(password: string): Promise<Result<void>> {
    const comparePassword =
      await MakeEncryptationProvider.getProvider().compareHash(
        password,
        this.get('password'),
      );

    return comparePassword ? Result.Ok() : Result.fail('Senha incorreta');
  }

  public async changePassword(
    newPassword: string,
    repeatPassword?: string,
  ): Promise<Result<void>> {
    if (!repeatPassword) {
      return Result.fail('Obrigatório confirmar senha');
    }

    if (newPassword !== repeatPassword) {
      return Result.fail('As senhas são diferentes');
    }

    if (checkPasswordStrength(newPassword) === StrengthPassword.weak) {
      return Result.fail('Senha não atende aos requisitos');
    }

    const hashPassword = await this.encryptation.generateHash(newPassword);

    this.change('password', hashPassword);

    return Result.Ok();
  }

  public setActive(): Result<void> {
    this.change('active', true);
    return Result.Ok();
  }

  public setInactive(): Result<void> {
    this.change('active', false);
    return Result.Ok();
  }

  public getUserMenu(): Result<UserMenu> {
    const userPermission = this.get('permission');
    return Result.Ok(menuInterfaces[userPermission]());
  }
}
