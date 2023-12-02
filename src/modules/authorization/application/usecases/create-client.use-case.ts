import { IClientRepository } from '@modules/client/domain';

import { IUseCase, Result } from 'types-ddd';
import {
  CreateClientUseCaseDTOInput,
  CreateClientUseCaseDTOOutput,
} from './dtos';
import { PartnerTypeEnum } from '@shared/utils';
import { makeCompany } from '@shared/providers';
import { makeCreateClient } from '@modules/client';

type Input = CreateClientUseCaseDTOInput;
type Output = CreateClientUseCaseDTOOutput;

export class CreateNewClientByBaaS implements IUseCase<Input, Result<Output>> {
  constructor(private readonly clientRepository: IClientRepository) {}

  public async execute({
    document,
    integrationId,
  }: Input): Promise<Result<Output>> {
    const baasResponse = await makeCompany().requestCompanyByDocument(
      document,
      integrationId,
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
      integrationId,
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
              name: pf.fullName,
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

    const createClientInstance = clientCreated.value();

    return Result.Ok(createClientInstance);
  }
}
