import { ClientAccountPlan, IClientRepository } from '@modules/client/domain';
import { ID, IUseCase, Result } from 'types-ddd';
import {
  CreateClientAccountPlanUseCaseDTOInput,
  CreateClientAccountPlanUseCaseDTOOutput,
} from './dtos';
import { makeGetUserById } from '@modules/user';

type Input = CreateClientAccountPlanUseCaseDTOInput;
type Output = CreateClientAccountPlanUseCaseDTOOutput;

export class CreateClientAccountPlan
  implements IUseCase<Input, Result<Output>>
{
  constructor(private readonly clientRepository: IClientRepository) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const isValidInput = this.validateInput(data);

    if (isValidInput.isFail()) return Result.fail(isValidInput.error());

    const client = await this.clientRepository.findClientById(data.clientId);

    if (client.isFail()) {
      return Result.fail(client.error());
    }

    const user = await makeGetUserById().execute({
      userId: data.userId,
    });

    if (user.isFail()) {
      return Result.fail(user.error());
    }

    const newPlan = ClientAccountPlan.create({
      baasPlanId: data.baasPlanId,
      clientId: client.value().id,
      description: data.description,
      monthlyPayment: data.monthlyPayment,
      name: data.name,
      userId: ID.create(user.value().id),
    });

    if (newPlan.isFail()) {
      return Result.fail(newPlan.error());
    }

    const createdPlan = await this.clientRepository.createClientAccountPlan(
      newPlan.value(),
    );

    if (createdPlan.isFail()) return Result.fail(createdPlan.error());

    return Result.Ok({
      ...createdPlan.value(),
    });
  }

  private validateInput(data: Input): Result<void> {
    const { baasPlanId, name } = data;
    if (!baasPlanId) return Result.fail('Id do plano não informado');

    if (!name) return Result.fail('Nome do plano não informado');

    return Result.Ok();
  }
}
