import {
  EconomicGroup,
  EconomicGroupContact,
  IEconomicGroupRepository,
} from '@modules/economic-group/domain';
import { IUseCase, Result } from 'types-ddd';
import {
  CreateEconomicGroupUseCaseDTOInput,
  CreateEconomicGroupUseCaseDTOOutput,
} from './dtos';

type Input = CreateEconomicGroupUseCaseDTOInput;
type Output = CreateEconomicGroupUseCaseDTOOutput;

export class CreateEconomicGroup implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly economicGroupRepository: IEconomicGroupRepository,
  ) {}

  public async execute(data: Input): Promise<Result<Output>> {
    if (data.contacts.length === 0) {
      return Result.fail('Informar no mínimo um contato');
    }

    const list = await this.economicGroupRepository.listEconomicGroups({
      name: data.name,
      page: 1,
      pageSize: 1,
    });

    if (list.value() && list.value().data.length > 1) {
      return Result.fail(
        `Grupo Econômico já existente: ${list.value().data[0].get('name')}`,
      );
    }

    const contacts: Array<Result<EconomicGroupContact>> = [];

    for (const contact of data.contacts) {
      const newEconomicGroupContact = EconomicGroupContact.create({
        ...contact,
      });

      if (newEconomicGroupContact.isFail()) {
        return Result.fail(newEconomicGroupContact.error());
      }

      contacts.push(newEconomicGroupContact);
    }

    const newEconomicGroup = EconomicGroup.create({
      name: data.name,
      active: data.active ?? EconomicGroup.getDefaultActive(),
      note: data.note ?? null,
      contacts,
    });

    if (newEconomicGroup.isFail()) {
      return Result.fail(newEconomicGroup.error());
    }

    const createdEconomicGroup =
      await this.economicGroupRepository.createEconomicGroup(
        newEconomicGroup.value(),
      );

    if (createdEconomicGroup.isFail())
      return Result.fail(createdEconomicGroup.error());

    return Result.Ok({
      ...createdEconomicGroup.value(),
    });
  }
}
