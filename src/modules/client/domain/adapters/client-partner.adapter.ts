import { IAdapter, ID, Result } from 'types-ddd';
import { ClientPartners } from '../aggregates';
import { ClientPartnerDBO } from '@modules/client/infra';
import { PartnerTypeEnum } from '@shared/utils';

export class AdapterClientPartnerDBOToDomain
  implements IAdapter<ClientPartnerDBO, ClientPartners>
{
  public build(data: ClientPartnerDBO): Result<ClientPartners> {
    const clientPartner = ClientPartners.create({
      document: data.document,
      documenType: data.documen_type as PartnerTypeEnum,
      name: data.name,
      birthdayDate: data.birthday_date
        ? new Date(data.birthday_date)
        : undefined,
      city: data.city ?? undefined,
      complement: data.complement ?? undefined,
      country: data.country ?? undefined,
      number: data.number ?? undefined,
      phone: data.phone ?? undefined,
      state: data.state ?? undefined,
      street: data.street ?? undefined,
      zip: data.zip ?? undefined,
      id: ID.create(data.id),
      clientId: ID.create(data.client_id),
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    });

    if (clientPartner.isFail()) return Result.fail(clientPartner.error());

    return Result.Ok(clientPartner.value());
  }
}
