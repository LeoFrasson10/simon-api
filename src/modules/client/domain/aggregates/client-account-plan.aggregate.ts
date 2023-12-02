import { DefaultAggregateProps } from '@shared/types';
import { Aggregate, Result, UID } from 'types-ddd';
import { Client } from './client.aggregate';
import { User } from '@modules/user';

type ClientAccountPlanProps = DefaultAggregateProps & {
  baasPlanId: string;
  name: string;
  description: string;
  monthlyPayment: number;
  clientId: UID;
  client?: Result<Client>;
  userId: UID;
  user?: Result<User>;
};

export class ClientAccountPlan extends Aggregate<ClientAccountPlanProps> {
  constructor(props: ClientAccountPlanProps) {
    super(props);
  }

  public static isValid(data: ClientAccountPlanProps): Result<void> {
    const { baasPlanId } = data;
    const { string } = this.validator;

    if (string(baasPlanId).isEmpty()) {
      return Result.fail('Id do plano não informado');
    }

    return Result.Ok();
  }

  public static create(
    props: ClientAccountPlanProps,
  ): Result<ClientAccountPlan> {
    const isValid = ClientAccountPlan.isValid(props);

    if (isValid.isFail()) return Result.fail(isValid.error());

    return Result.Ok(new ClientAccountPlan(props));
  }
}
