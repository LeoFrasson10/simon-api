import { IAdapter, ID, Result } from 'types-ddd';
import { ClientAccountPlan } from '../aggregates';
import { ClientAccountPlanDBO } from '@modules/client/infra';

export class AdapterClientAccountPlanDBOToDomain
  implements IAdapter<ClientAccountPlanDBO, ClientAccountPlan>
{
  public build(data: ClientAccountPlanDBO): Result<ClientAccountPlan> {
    const clientAccountPlan = ClientAccountPlan.create({
      baasPlanId: data.baas_plan_id,
      clientId: ID.create(data.client_id),
      userId: ID.create(data.user_id),
      description: data.description,
      monthlyPayment: data.monthly_payment,
      name: data.name,
      id: ID.create(data.id),
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    });

    if (clientAccountPlan.isFail())
      return Result.fail(clientAccountPlan.error());

    return Result.Ok(clientAccountPlan.value());
  }
}
