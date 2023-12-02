import {
  Client,
  ClientAccount,
  ClientOperators,
  ClientPartners,
  IClientRepository,
} from '@modules/client/domain';
import { makeGetAllServices, makeGetStandardServices } from '@modules/services';
import { ID, IUseCase, Result } from 'types-ddd';
import {
  CreateClientUseCaseDTOInput,
  CreateClientUseCaseDTOOutput,
} from './dtos';
import { makeGetIntegrationById } from '@modules/integrations';
import { ILois } from '@shared/providers';

type Input = CreateClientUseCaseDTOInput;
type Output = CreateClientUseCaseDTOOutput;

export class CreateClient implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly loisProvider: ILois,
  ) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const integration = await makeGetIntegrationById().execute({
      integrationId: data.integrationId,
    });

    if (integration.isFail()) {
      return Result.fail(integration.error());
    }

    const isExistsClient =
      await this.clientRepository.findClientByDocumentAndIntegration(
        data.document,
        data.integrationId,
      );

    if (isExistsClient.value()) {
      return Result.fail('Cliente já cadastrado');
    }

    let modulesKeys = data.standardServices;

    if (data.standardServices) {
      const verify = await makeGetAllServices().execute({
        page: 1,
        pageSize: 10,
        filters: {
          keys: data.standardServices,
        },
      });
      if (verify.value().totalRecords !== data.standardServices.length) {
        return Result.fail('Serviços não encontrados');
      }
    } else {
      const standardServices = await makeGetStandardServices().execute();

      if (standardServices.isFail())
        return Result.fail(standardServices.error());

      modulesKeys = standardServices.value().data.map((e) => e.key);
    }

    const newClient = Client.create({
      baasId: data.baasId,
      integrationId: ID.create(integration.value().id),
      name: data.name,
      email: data.email,
      document: data.document,
      type: data.type,
      subject: data.subject,
      nature: data.nature,
      exemptStateRegistration: data.exemptStateRegistration,
      stateRegistration: data.stateRegistration,
      street: data.street,
      number: data.number,
      complement: data.complement,
      zip: data.zip,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      country: data.country,
      openingDate: data.openingDate,
      approvedDate: data.approvedDate,
      monthlyInvoicing: data.monthlyInvoicing,
      phone: data.phone,
      establishmentId: data.establishmentId,
    });

    if (newClient.isFail()) {
      return Result.fail(newClient.error());
    }

    const clientInstance = newClient.value();

    const newOperators = data.operators.map((op) => {
      const operator = ClientOperators.create({
        blocked: op.blocked,
        clientId: clientInstance.get('id'),
        document: op.document,
        email: op.email,
        name: op.name,
        permission: op.permission,
      });

      if (operator.isOk()) {
        return operator;
      }
    });

    const partners = data.partnersPJ.concat(data.partnersPF);

    const newPartners = partners.map((pt) => {
      const partner = ClientPartners.create({
        document: pt.document,
        documenType: pt.documentType,
        name: pt.name,
        birthdayDate: pt.birthday_date ?? null,
        city: pt.city ?? null,
        complement: pt.complement ?? null,
        country: pt.country ?? null,
        clientId: clientInstance.id,
        number: pt.number ?? null,
        phone: pt.phone ?? null,
        state: pt.state ?? null,
        zip: pt.zip ?? null,
        street: pt.street ?? null,
        neighborhood: pt.neighborhood ?? null,
      });

      if (partner.isOk()) {
        return partner;
      }
    });

    const newAccount = ClientAccount.create({
      accountNumber: data.account.accountNumber,
      accountType: data.account.accountType,
      baasAccountId: data.account.baasAccountId,
      bankNumber: data.account.bankNumber,
      branchNumber: data.account.branchNumber,
      clientId: clientInstance.id,
      branchDigit: data.account.branchDigit,
    });

    clientInstance.setOperators(newOperators);
    clientInstance.setAccount(newAccount);
    clientInstance.setPartner(newPartners);

    const createdClient = await this.clientRepository.createClient(
      clientInstance,
      integration.value().fullAccess ? modulesKeys : [],
    );

    if (createdClient.isFail()) return Result.fail(createdClient.error());

    if (integration.value().name === 'Flowbanco') {
      const clientCreatedLois = await this.loisProvider.createClient({
        ...clientInstance.toObject(),
        account: clientInstance.get('accounts')?.value().toObject(),
        operators: clientInstance
          .get('operators')
          .map((op) => op.value().toObject()),
        partners: clientInstance
          .get('partners')
          .map((p) => p.value().toObject()),
      });

      if (clientCreatedLois.isFail()) {
        return Result.fail(clientCreatedLois.error());
      }
    }

    return Result.Ok({
      ...createdClient.value(),
    });
  }
}
