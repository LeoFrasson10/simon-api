import { services } from '@shared/config';
import { makeCompany, makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';
import { CreateWaiverClientDTO } from '@modules/apis/waiver/infra';
import {
  makeCreateClient,
  makeGetClientByDocumentAndIntegration,
  makeGetClientsByEconomicGroup,
} from '@modules/client';
import { PartnerTypeEnum } from '@shared/utils';
import { makeGetEconomicGroupById } from '@modules/economic-group';

type Input = CreateWaiverClientDTO;
type Output = any;

export class CreateWaiverClient implements IUseCase<Input, Result<Output>> {
  public async execute(data: Input): Promise<Result<Output>> {
    const economicGroup = await makeGetEconomicGroupById().execute({
      economicGroupId: data.economicGroupId,
    });

    if (economicGroup.isFail()) return Result.fail(economicGroup.error());

    const clientsGroup = await makeGetClientsByEconomicGroup().execute({
      economicGroupId: economicGroup.value().id,
    });

    if (clientsGroup.isFail()) return Result.fail(clientsGroup.error());

    if (
      clientsGroup.value().length === 0 ||
      !clientsGroup.value().find((cg) => cg.document === data.document)
    ) {
      return Result.fail('CNPJ não pertence ao grupo econômico');
    }

    const existClient = await makeGetClientByDocumentAndIntegration().execute({
      document: data.document,
      integrationId: data.integrationId,
    });

    if (!existClient.value()) {
      const baasResponse = await makeCompany().requestCompanyByDocument(
        data.document,
      );

      if (baasResponse.isFail()) {
        return Result.fail(baasResponse.error());
      }

      const company = baasResponse.value().company;

      const companyAddress = company.address;
      const { countryCode, area, phone } = company.phone;
      const account = company.alias_account;
      const partnersPFBaaS = company.partnersPF;
      const partnersPJBaaS = company.partnersPJ;

      const clientCreated = await makeCreateClient().execute({
        baasId: company._id,
        city: companyAddress.city,
        country: companyAddress.country,
        neighborhood: companyAddress.neighborhood,
        number: companyAddress.number,
        state: companyAddress.state,
        street: companyAddress.street,
        zip: companyAddress.zip,
        complement: companyAddress.complement,
        document: company.documentNumber,
        email: company.companyEmail,
        integrationId: data.integrationId,
        name: company.companyName,
        nature: company.companyNature,
        phone: `${countryCode}${area}${phone}`,
        subject: company.companySubject,
        type: company.companyType,
        openingDate: company.openingDate,
        exemptStateRegistration: company.exemptStateRegistration,
        stateRegistration: company.stateRegistration,
        monthlyInvoicing: Number(company.monthlyInvoicing) / 100,
        moduleClientId: '',
        operators: company.operators,
        approvedDate: company.approved_date || null,
        // standardServices: data.servicesKey,
        account: {
          accountNumber: account.account_number,
          accountType: account.account_type,
          baasAccountId: company.accountId || '',
          bankNumber: account.bank_number,
          branchNumber: account.branch_number,
          branchDigit: account.branch_digit,
        },
        partnersPF:
          partnersPFBaaS.length > 0
            ? partnersPFBaaS.map((pf) => ({
                document: pf.documentNumber,
                documentType: PartnerTypeEnum.cpf,
                name: pf.documentNumber,
                birthday_date: pf.birthdayDate,
                city: pf.address.city,
                country: pf.address.country,
                complement: pf.address.complement || '',
                neighborhood: pf.address.neighborhood,
                number: pf.address.number,
                state: pf.address.state,
                street: pf.address.street,
                zip: pf.address.zip,
                phone: `${pf.phone.countryCode}${pf.phone.area}${pf.phone.phone}`,
              }))
            : [],
        partnersPJ:
          partnersPJBaaS.length > 0
            ? partnersPJBaaS.map((pj) => ({
                document: pj.documentNumber,
                name: pj.companyName,
                documentType: PartnerTypeEnum.cnpj,
              }))
            : [],
      });

      if (clientCreated.isFail()) {
        return Result.fail(clientCreated.error());
      }

      const client = clientCreated.value();

      const payload = {
        name: client.name,
        email: client.email,
        document: client.document,
        economicGroupId: economicGroup.value().id,
        phone: client.phone,
        clientId: client.id,
        establishmentId: data.establishmentId,
      };

      const createClient = await makeHttpClient().requestExternalModule({
        url: `${services.baseUrlWaiver}/client`,
        method: 'post',
        body: payload,
        module: 'waiver',
        integrationId: data.integrationId,
      });

      if (createClient.isFail()) {
        // deletar o cliente caso der erro
        return Result.fail(createClient.error());
      }

      return Result.Ok(company);
    }

    const client = existClient.value();

    const payload = {
      name: client.name,
      email: client.email,
      document: client.document,
      economicGroupId: economicGroup.value().id,
      phone: client.phone,
      clientId: client.id,
      establishmentId: data.establishmentId,
    };

    const createCliente = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlWaiver}/client`,
      method: 'post',
      body: payload,
      module: 'waiver',
      integrationId: data.integrationId,
    });

    if (createCliente.isFail()) return Result.fail(createCliente.error());

    return Result.Ok(createCliente.value().response);
  }
}
