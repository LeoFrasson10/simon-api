import { IUseCase, Result } from 'types-ddd';
import {
  ClientToPlan,
  UpdatePlanAccountsUseCaseDTOInput,
  UpdatePlanAccountsUseCaseDTOOutput,
} from './dtos';
import { makeCompany } from '@shared/providers';
import { makeGetUserById } from '@modules/user';
import {
  makeCreateClientAccountPlan,
  makeGetClientById,
} from '@modules/client';

type Input = UpdatePlanAccountsUseCaseDTOInput;
type Output = UpdatePlanAccountsUseCaseDTOOutput;

export class ChangePlanOfAccounts implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const user = await makeGetUserById().execute({
      userId: data.userId,
    });

    if (user.isFail()) return Result.fail(user.error());

    if (!data.servicePlanId) {
      return Result.fail('Id do plano é obrigatório');
    }

    if (!data.clientsId || data.clientsId.length === 0) {
      return Result.fail('Informe no mínimo um cliente');
    }

    const plans = await makeCompany().listPlans();

    if (plans.isFail()) {
      return Result.fail(plans.error());
    }

    const existPlan = plans
      .value()
      .itens.find((p) => p.id === data.servicePlanId);

    if (!existPlan) {
      return Result.fail('Plano não encontrado');
    }

    const clients: ClientToPlan[] = [];

    for (const clientId of data.clientsId) {
      const client = await makeGetClientById().execute({
        clientId,
      });

      if (client.isFail()) Result.fail(client.error());

      clients.push(client.value());
    }

    const result = await makeCompany().changePlanOfAccounts({
      debit: data.isDebit,
      documents: clients.map((c) => c.document),
      service_plan_id: data.servicePlanId,
    });

    if (result.isFail()) return Result.fail(result.error());

    const resultErrors =
      result.value().errors.length > 0
        ? result.value().errors.map((e) => e.document)
        : [];

    const clientsUpdatedPlan =
      resultErrors.length > 0
        ? clients.filter((c) => resultErrors.includes(c.document))
        : clients;

    for await (const c of clientsUpdatedPlan) {
      const createClientPlan = await makeCreateClientAccountPlan().execute({
        baasPlanId: data.servicePlanId,
        clientId: c.id,
        description: existPlan.description,
        name: existPlan.name,
        monthlyPayment: existPlan.monthly_payment,
        userId: user.value().id,
      });

      if (createClientPlan.isFail()) {
        console.log(
          `Erro ao criar registro de plano: ${createClientPlan.error()}`,
        );
      }
    }

    return Result.Ok(result.value());
  }
}
