import {
  EconomicGroupContact,
  EconomicGroupContactDBO,
} from '@modules/economic-group';
import { IAdapter, ID, Result } from 'types-ddd';

export class AdapterEconomicGroupContactDBOToDomain
  implements IAdapter<EconomicGroupContactDBO, EconomicGroupContact>
{
  public build(data: EconomicGroupContactDBO): Result<EconomicGroupContact> {
    const economicGroupContact = EconomicGroupContact.create({
      email: data.email,
      name: data.name,
      position: data.position,
      primaryPhone: data.primary_phone,
      note: data.note,
      secondaryPhone: data.secondary_phone,
      id: ID.create(data.id),
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    });

    if (economicGroupContact.isFail())
      return Result.fail(economicGroupContact.error());

    return Result.Ok(economicGroupContact.value());
  }
}
