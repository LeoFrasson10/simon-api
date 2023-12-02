import { IEconomicGroupRepository } from '@modules/economic-group/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  GetEconomicGroupUseCaseDTOInput,
  GetEconomicGroupUseCaseDTOOutput,
} from './dtos';

type Input = GetEconomicGroupUseCaseDTOInput;
type Output = GetEconomicGroupUseCaseDTOOutput;

export class GetEconomicGroupById implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly economicGroupRepository: IEconomicGroupRepository,
  ) {}

  public async execute({ economicGroupId }: Input): Promise<Result<Output>> {
    const economicGroup =
      await this.economicGroupRepository.findEconomicGroupById(economicGroupId);

    if (economicGroup.isFail()) return Result.fail(economicGroup.error());

    const economicGroupInstance = economicGroup.value();

    return Result.Ok({
      id: economicGroupInstance.id.value(),
      name: economicGroupInstance.get('name'),
      createdAt: economicGroupInstance.get('createdAt'),
      updatedAt: economicGroupInstance.get('updatedAt'),
      active: economicGroupInstance.get('active'),
      contacts: economicGroupInstance
        .get('contacts')
        .map((c) => ({ ...c.value().toObject() })),
      clients: economicGroupInstance.get('clients')
        ? economicGroupInstance.get('clients').map((c) => ({
            id: c.value().id.value(),
            name: c.value().get('name'),
            document: c.value().get('document'),
            establishmentId: c.value().get('establishmentId') ?? null,
          }))
        : null,
    });
  }
}
