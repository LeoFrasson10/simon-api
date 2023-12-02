import { IUseCase, Result } from 'types-ddd';
import { CreateClientByCallbackUseCaseDTOInput } from './dtos';
import { IBaaS } from '@shared/providers';
import { makeCreateClient } from '@modules/client';
import { PartnerTypeEnum } from '@shared/utils';
import { makeCreateIndividualClient } from '../factories';

type Input = CreateClientByCallbackUseCaseDTOInput;
type Output = string;

export class CreateClientByCallbackBaaS
  implements IUseCase<Input, Result<Output>>
{
  constructor(private readonly baasProvider: IBaaS) { }
  public async execute(data: Input): Promise<Result<Output>> {
    const clientAccountBaas = await this.baasProvider.getBaaSAccountById(
      data.accountId,
    );

    if (clientAccountBaas.isFail())
      return Result.fail(clientAccountBaas.error());

    const clientAccountBaasValue = clientAccountBaas.value();

    if (data.document.length === 14) {
      const clientBaaS = await this.baasProvider.getCompanyById(
        clientAccountBaasValue.company_id,
      );

      if (clientBaaS.isFail()) return Result.fail(clientBaaS.error());
      const {
        address,
        companyEmail,
        companyName,
        companyNature,
        companyType,
        companySubject,
        _id,
        monthlyInvoicing,
        phone: { area, countryCode, phone },
        accountId,
        partnersPF,
        partnersPJ,
        approved_date,
        documentNumber,
        ...rest
      } = clientBaaS.value();

      const client = {
        ...address,
        ...rest,
        document: documentNumber,
        integrationId: data.integrationId,
        baasId: _id,
        name: companyName,
        email: companyEmail,
        type: companyType,
        nature: companyNature,
        subject: companySubject,
        phone: `${countryCode}${area}${phone}`,
        approvedDate: approved_date,
        monthlyInvoicing: Number(monthlyInvoicing) / 100,
        partnersPF:
          partnersPF && partnersPF.length > 0
            ? partnersPF.map((pf) => ({
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
          partnersPJ && partnersPJ.length > 0
            ? partnersPJ.map((pj) => ({
              document: pj.documentNumber,
              name: pj.companyName,
              documentType: PartnerTypeEnum.cnpj,
            }))
            : [],
        moduleClientId: '',
        account: {
          accountNumber: clientAccountBaasValue.alias_account.account_number,
          accountType: clientAccountBaasValue.alias_account.account_type,
          baasAccountId: accountId || '',
          bankNumber: clientAccountBaasValue.alias_account.bank_number,
          branchNumber: clientAccountBaasValue.alias_account.branch_number,
          branchDigit: clientAccountBaasValue.alias_account.branch_digit,
        },
      };

      const clientCreated = await makeCreateClient().execute(client);

      if (clientCreated.isFail()) return Result.fail(clientCreated.error());

      return Result.Ok(`Client criado: ${client.document}`);
    } else {
      const clientBaaSPfCreated = await makeCreateIndividualClient().execute({
        document: data.document,
        integrationId: data.integrationId
      })

      if (clientBaaSPfCreated.isFail()) return Result.fail(clientBaaSPfCreated.error())
      return Result.Ok(`Client criado: ${clientBaaSPfCreated.value().document} `);
    }
  }
}
