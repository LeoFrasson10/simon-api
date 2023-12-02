import { DefaultAggregateProps } from '@shared/types';
import { Aggregate, Result, UID } from 'types-ddd';
import { Client } from './client.aggregate';

type ClientAccountProps = DefaultAggregateProps & {
  baasAccountId: string;
  accountNumber: string;
  accountType: string;
  bankNumber: string;
  branchDigit?: string;
  branchNumber: string;
  clientId: UID;
  client?: Result<Client>;
};

export class ClientAccount extends Aggregate<ClientAccountProps> {
  constructor(props: ClientAccountProps) {
    super(props);
  }

  public static isValid(data: ClientAccountProps): Result<void> {
    const { accountNumber, bankNumber } = data;
    const { string } = this.validator;

    if (string(accountNumber).isEmpty()) {
      return Result.fail('Número da conta não informada');
    }

    if (string(bankNumber).isEmpty()) {
      return Result.fail('Código do banco não informado');
    }

    return Result.Ok();
  }

  public static create(props: ClientAccountProps): Result<ClientAccount> {
    const isValid = ClientAccount.isValid(props);

    if (isValid.isFail()) return Result.fail(isValid.error());

    return Result.Ok(new ClientAccount(props));
  }
}
