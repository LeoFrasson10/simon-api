import { IClientRepository } from '@modules/client/domain';
import { makeCompany } from '@shared/providers';
import { CompanyItemListModal } from '@shared/providers/baas-company/implementations/dtos';
import { IUseCase, Logger, Result } from 'types-ddd';
import { makeCreateClient } from '../factories';
import { PartnerTypeEnum } from '@shared/utils';
import { makeGetAllIntegrations } from '@modules/integrations';
import { CreateClientOutput } from './dtos';
import { makeCreateLoisClients } from '@modules/baas/application';

type Input = any;
type Output = any;

export class CreateNewClientsBaaS implements IUseCase<Input, Result<Output>> {
  constructor(private readonly clientRepository: IClientRepository) {}

  public async execute(): Promise<Result<Output>> {
    const allCompanies: CompanyItemListModal[] = [];
    let pageNumber = 1;
    let totalPages = 1;

    const limitData = 1000;

    while (pageNumber <= totalPages) {
      const companiesBaaS = await makeCompany().listCompanies(
        pageNumber,
        limitData,
      );

      if (companiesBaaS.isFail()) {
        return Result.fail(companiesBaaS.error());
      }

      const companiesBaaSValue = companiesBaaS.value();

      allCompanies.push(...companiesBaaSValue.docs);

      pageNumber = companiesBaaSValue.page + 1;
      totalPages = companiesBaaSValue.totalPages;
    }

    const integration = await makeGetAllIntegrations().execute({
      filters: {
        name: 'Flowbanco',
      },
      page: 1,
      pageSize: 1,
    });

    if (integration.value() && integration.value().totalRecords === 0) {
      return Result.fail('Integração não encontrada');
    }

    const result: CreateClientOutput[] = [];

    for await (const c of allCompanies) {
      const existClient = await this.clientRepository.findClientByBaaSId(c.id);

      if (existClient.isOk()) {
        const clientInstance = existClient.value();

        if (!clientInstance.get('approvedDate') && c.approved_date) {
          clientInstance.change('approvedDate', new Date(c.approved_date));
          await this.clientRepository.changeClientApprovedDate(clientInstance);

          result.push({
            baasId: c.id,
            details: `Update na data de aprovação de cliente já cadastrado: ${c.companyName}`,
            clientId: clientInstance.id.value(),
            document: c.documentNumber,
            error: false,
          });
        }
      } else if (existClient.isFail()) {
        const companyBaaS = await makeCompany().getCompanyById(c.id);

        const companyValue = companyBaaS.value();

        const companyAddress = companyValue.address;
        const { countryCode, area, phone } = companyValue.phone;
        const account = companyValue.externalAliasAccount;

        const partnersPFBaaS = companyValue.partnersPF;
        const partnersPJBaaS = companyValue.partnersPJ;

        if (!account.account_number) {
          result.push({
            baasId: c.id,
            details: 'Empresa sem conta',
            document: c.documentNumber,
            error: true,
          });
          continue;
        }

        const newClient = await makeCreateClient().execute({
          baasId: companyValue._id,
          city: companyAddress.city,
          country: companyAddress.country,
          neighborhood: companyAddress.neighborhood,
          number: companyAddress.number,
          state: companyAddress.state,
          street: companyAddress.street,
          zip: companyAddress.zip,
          complement: companyAddress.complement,
          document: companyValue.documentNumber,
          email: companyValue.companyEmail,
          integrationId: integration.value().data[0].id,
          name: companyValue.companyName,
          nature: companyValue.companyNature,
          phone: `${countryCode}${area}${phone}`,
          subject: companyValue.companySubject,
          type: companyValue.companyType,
          openingDate: companyValue.openingDate,
          exemptStateRegistration: companyValue.exemptStateRegistration,
          stateRegistration: companyValue.stateRegistration,
          monthlyInvoicing: Number(companyValue.monthlyInvoicing) / 100,
          moduleClientId: '',
          operators: companyValue.operators,
          establishmentId: null,
          approvedDate: companyValue.approved_date || null,
          account: {
            accountNumber: account.account_number,
            accountType: account.account_type,
            baasAccountId: companyValue.accountId || '',
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

        if (newClient.isFail()) {
          result.push({
            baasId: c.id,
            details: newClient.error(),
            document: c.documentNumber,
            error: true,
          });
          continue;
        }

        result.push({
          clientId: newClient.value().id,
          baasId: c.id,
          details: `Novo client cadastrado: ${newClient.value().name}`,
          document: c.documentNumber,
          error: false,
        });
      } else {
        result.push({
          error: true,
          baasId: c.id,
          details: 'Erro ao cadastrar novos clientes',
          document: c.documentNumber,
        });
        continue;
      }
    }

    const loisUpdate = await makeCreateLoisClients().execute({
      integrationId: integration.value().data[0].id,
    });

    if (loisUpdate.isFail()) {
      Logger.error(loisUpdate.error());
    }

    console.log({
      total: result.length,
      result,
      lois: loisUpdate.value(),
    });

    return Result.Ok();
  }
}
