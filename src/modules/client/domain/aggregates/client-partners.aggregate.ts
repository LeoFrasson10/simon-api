import { DefaultAggregateProps } from '@shared/types';
import { PartnerTypeEnum } from '@shared/utils';
import { Aggregate, Result, UID } from 'types-ddd';
import { Client } from './client.aggregate';

type ClientPartnersProps = DefaultAggregateProps & {
  name: string;
  document: string;
  documenType: PartnerTypeEnum;
  birthdayDate?: Date;
  phone?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: string;
  clientId: UID;
  client?: Result<Client>;
};

export class ClientPartners extends Aggregate<ClientPartnersProps> {
  constructor(props: ClientPartnersProps) {
    super(props);
  }

  public static isValid(data: ClientPartnersProps): Result<void> {
    const { document, name } = data;
    const { string } = this.validator;

    if (string(document).isEmpty()) {
      return Result.fail('Documento do operador não informado');
    }

    if (string(name).isEmpty()) {
      return Result.fail('Nome do operador não informado');
    }

    return Result.Ok();
  }
  public static create(props: ClientPartnersProps): Result<ClientPartners> {
    const isValid = ClientPartners.isValid(props);

    if (isValid.isFail()) return Result.fail(isValid.error());

    return Result.Ok(new ClientPartners(props));
  }
}
