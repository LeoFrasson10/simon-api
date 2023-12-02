import { Integration } from '@modules/integrations';
import { isValidDocument } from '@shared/helpers';
import { DefaultAggregateProps } from '@shared/types';
import { Aggregate, ID, Result, UID } from 'types-ddd';
import { ClientAccount } from './client-accounts.aggregate';
import { ClientOperators } from './client-operators.aggregate';
import { ClientPartners } from './client-partners.aggregate';
import { EconomicGroup } from '@modules/economic-group';
import { ServiceClient } from '@modules/service-client';

type ClientProps = DefaultAggregateProps & {
  integrationId: UID;
  integration?: Result<Integration>;

  economicGroupId?: UID;
  economicGroup?: Result<EconomicGroup>;

  serviceClientId?: string;
  serviceClient?: Result<ServiceClient>;

  baasId?: string;
  name: string;
  email?: string;
  document: string;
  type?: string;
  subject?: string;
  nature?: string;
  establishmentId?: string;
  exemptStateRegistration?: boolean;
  stateRegistration?: string;
  street: string;
  number: string;
  complement?: string;
  zip: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  openingDate?: Date;
  approvedDate?: Date;
  monthlyInvoicing?: number;
  phone?: string;

  gender?: string
  motherName?: string
  birthDate?: Date
  nationality?: string
  nationalityState?: string
  profession?: string
  incomeValue?: number

  accounts?: Result<ClientAccount>;
  operators?: Array<Result<ClientOperators>>;
  partners?: Array<Result<ClientPartners>>;
};

export class Client extends Aggregate<ClientProps> {
  constructor(props: ClientProps) {
    super(props);
  }

  public static isValid(data: ClientProps): Result<void> {
    const {
      // city,
      // country,
      document,
      integrationId,
      name,
      // neighborhood,
      // number,
      // state,
      // street,
      // zip,
    } = data;
    const { string } = this.validator;

    if (string(integrationId.value()).isEmpty()) {
      return Result.fail('Integração não informada');
    }

    if (string(name).isEmpty()) {
      return Result.fail('Nome é obrigatório');
    }

    if (string(document).isEmpty()) {
      return Result.fail('CPF/CNPJ é obrigatório');
    }

    if (!isValidDocument(document.length === 11 ? 'cpf' : 'cnpj', document)) {
      return Result.fail('CPF/CNPJ inválido');
    }

    // if (
    //   string(street).isEmpty() ||
    //   string(number).isEmpty() ||
    //   string(neighborhood).isEmpty() ||
    //   string(state).isEmpty() ||
    //   string(city).isEmpty() ||
    //   string(country).isEmpty() ||
    //   string(zip).isEmpty()
    // ) {
    //   return Result.fail('Informações de endereço incompleto');
    // }

    return Result.Ok();
  }

  public setOperators(operators: Array<Result<ClientOperators>>) {
    return this.change('operators', operators);
  }

  public setAccount(account: Result<ClientAccount>) {
    return this.change('accounts', account);
  }

  public setPartner(partners: Array<Result<ClientPartners>>) {
    return this.change('partners', partners);
  }

  public setEconomicGroupId(economicGroupId: string) {
    return this.change('economicGroupId', ID.create(economicGroupId));
  }

  public setEstablishmentId(establishmentId: string) {
    return this.change('establishmentId', establishmentId);
  }

  public static create(props: ClientProps): Result<Client> {
    const isValid = Client.isValid(props);

    if (isValid.isFail()) return Result.fail(isValid.error());

    return Result.Ok(new Client(props));
  }
}
