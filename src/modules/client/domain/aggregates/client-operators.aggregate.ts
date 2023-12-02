import { DefaultAggregateProps } from '@shared/types';
import { Aggregate, Result, UID } from 'types-ddd';
import { Client } from './client.aggregate';

type ClientOperatorsProps = DefaultAggregateProps & {
  name: string;
  email: string;
  document: string;
  permission: string;
  blocked: boolean;
  clientId: UID;
  client?: Result<Client>;
};

export class ClientOperators extends Aggregate<ClientOperatorsProps> {
  constructor(props: ClientOperatorsProps) {
    super(props);
  }

  public static isValid(data: ClientOperatorsProps): Result<void> {
    const { document, name } = data;
    const { string } = this.validator;

    if (string(document).isEmpty()) {
      return Result.fail('Documento do operador não informado');
    }

    if (string(name).isEmpty()) {
      return Result.fail('Nome do operador não informado');
    }

    return Result.Ok();
  }

  public static create(props: ClientOperatorsProps): Result<ClientOperators> {
    const isValid = ClientOperators.isValid(props);

    if (isValid.isFail()) return Result.fail(isValid.error());

    return Result.Ok(new ClientOperators(props));
  }
}
