import { EconomicGroup, EconomicGroupDBO } from '@modules/economic-group';
import { IAdapter, ID, Result } from 'types-ddd';
import { AdapterEconomicGroupContactDBOToDomain } from './economic-group-contact.adapter';
import { AdapterClientDBOToDomain } from '@modules/client';

export class AdapterEconomicGroupDBOToDomain
  implements IAdapter<EconomicGroupDBO, EconomicGroup>
{
  public build(data: EconomicGroupDBO): Result<EconomicGroup> {
    const economicGroupContactAdapter =
      new AdapterEconomicGroupContactDBOToDomain();

    const clienttAdapter = new AdapterClientDBOToDomain();

    const economicGroup = EconomicGroup.create({
      active: data.active,
      name: data.name,
      note: data.note,
      contacts: data.contacts
        ? data.contacts.map((contact) =>
            economicGroupContactAdapter.build(contact),
          )
        : [],
      id: ID.create(data.id),
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      clients: data.clients
        ? data.clients.map((c) => clienttAdapter.build(c))
        : null,
    });

    if (economicGroup.isFail()) return Result.fail(economicGroup.error());

    return Result.Ok(economicGroup.value());
  }
}
