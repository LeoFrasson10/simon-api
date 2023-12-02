import { IAdapter, ID, Result } from 'types-ddd';
import {
  AdapterClientAccountDBOToDomain,
  AdapterClientOperatorDBOToDomain,
  AdapterClientPartnerDBOToDomain,
  Client,
} from '@modules/client/domain';
import { ClientDBO } from '@modules/client/infra';
import { AdapterIntegrationDBOToDomain } from '@modules/integrations/domain';
import { AdapterEconomicGroupDBOToDomain } from '@modules/economic-group/domain';
import { AdapterServiceClientDBOToDomain } from '@modules/service-client/domain';

export class AdapterClientDBOToDomain implements IAdapter<ClientDBO, Client> {
  public build(data: ClientDBO): Result<Client> {
    const integrationAdapter = new AdapterIntegrationDBOToDomain();
    const economicGroupAdapter = new AdapterEconomicGroupDBOToDomain();
    const serviceClientAdapter = new AdapterServiceClientDBOToDomain();
    const accountAdapter = new AdapterClientAccountDBOToDomain();
    const partnerAdapter = new AdapterClientPartnerDBOToDomain();
    const operatorAdapter = new AdapterClientOperatorDBOToDomain();

    const client = Client.create({
      id: ID.create(data.id),
      name: data.name,
      integrationId: ID.create(data.integration_id),
      baasId: data.baas_id,
      city: data.city,
      country: data.country,
      document: data.document,
      email: data.email,
      exemptStateRegistration: data.exempt_state_registration,
      serviceClientId: data.service_client_id,
      monthlyInvoicing: Number(data.monthly_invoicing),
      nature: data.nature,
      neighborhood: data.neighborhood,
      number: data.number,
      openingDate: data.opening_date ? new Date(data.opening_date) : undefined,
      approvedDate: data.approved_date
        ? new Date(data.approved_date)
        : undefined,
      phone: data.phone,
      state: data.state,
      street: data.street,
      subject: data.subject,
      type: data.type,
      zip: data.zip,
      complement: data.complement,
      economicGroupId: data.economic_group_id
        ? ID.create(data.economic_group_id)
        : null,
      stateRegistration: data.state_registration,
      establishmentId: data.establishment_id,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      integration: data.integration
        ? integrationAdapter.build(data.integration)
        : null,
      economicGroup: data.economic_group
        ? economicGroupAdapter.build(data.economic_group)
        : undefined,
      serviceClient: data.service_client
        ? serviceClientAdapter.build(data.service_client)
        : undefined,
      accounts: data.accounts ? accountAdapter.build(data.accounts) : undefined,
      operators: data.operators
        ? data.operators.map((account) => operatorAdapter.build(account))
        : undefined,
      partners: data.partners
        ? data.partners.map((account) => partnerAdapter.build(account))
        : undefined,
    });

    if (client.isFail()) return Result.fail(client.error());

    return Result.Ok(client.value());
  }
}
