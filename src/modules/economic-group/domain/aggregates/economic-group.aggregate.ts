import { DefaultAggregateProps } from '@shared/types';
import { Aggregate, Result } from 'types-ddd';
import { EconomicGroupContact } from './economic-group-contact.aggregate';
import { Client } from '@modules/client';

type EconomicGroupProps = DefaultAggregateProps & {
  name: string;
  active?: boolean;
  note?: string;
  contacts: Array<Result<EconomicGroupContact>>;
  clients?: Array<Result<Client>>;
};

export class EconomicGroup extends Aggregate<EconomicGroupProps> {
  constructor(props: EconomicGroupProps) {
    super(props);
  }

  public static isValid({ name, contacts }: EconomicGroupProps): Result<void> {
    const { string } = this.validator;

    if (string(name).isEmpty()) {
      return Result.fail('Nome de usuário obrigatório');
    }

    if (contacts.length === 0) {
      return Result.fail('Obrigatório informar no mínimo um contato');
    }

    return Result.Ok();
  }

  public static getDefaultActive(): boolean {
    return true;
  }

  public static create(props: EconomicGroupProps): Result<EconomicGroup> {
    const isValid = EconomicGroup.isValid(props);

    if (isValid.isFail()) return Result.fail(isValid.error());

    return Result.Ok(new EconomicGroup(props));
  }
}
