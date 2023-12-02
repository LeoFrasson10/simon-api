import { DefaultAggregateProps } from '@shared/types';
import { Aggregate, Result } from 'types-ddd';

type EconomicGroupContactProps = DefaultAggregateProps & {
  name: string;
  position: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email: string;
  note?: string;
};

export class EconomicGroupContact extends Aggregate<EconomicGroupContactProps> {
  constructor(props: EconomicGroupContactProps) {
    super(props);
  }

  public static isValid({
    email,
    name,
    primaryPhone,
    position,
  }: EconomicGroupContactProps): Result<void> {
    const { string } = this.validator;
    if (string(name).isEmpty()) {
      return Result.fail('Nome de contato obrigatório');
    }
    if (string(email).isEmpty()) {
      return Result.fail('E-mail de contato obrigatório');
    }
    if (string(primaryPhone).isEmpty()) {
      return Result.fail('Telefone principal de contato obrigatório');
    }
    if (string(position).isEmpty()) {
      return Result.fail('Cargo obrigatório');
    }

    return Result.Ok();
  }

  public static create(
    props: EconomicGroupContactProps,
  ): Result<EconomicGroupContact> {
    const isValid = EconomicGroupContact.isValid(props);

    if (isValid.isFail()) return Result.fail(isValid.error());

    return Result.Ok(new EconomicGroupContact(props));
  }
}
