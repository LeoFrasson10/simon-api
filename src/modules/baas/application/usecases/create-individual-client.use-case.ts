import { ID, IUseCase, Result } from "types-ddd";
import { CreateBaaSClientIndividualDTOInput } from "./dtos";
import { Client, ClientAccount, CreateClientOutput, IClientRepository } from "@modules/client";
import { makeCompany } from "@shared/providers";
import { makeGetIntegrationById } from "@modules/integrations";
import { makeGetStandardServices } from "@modules/services";

type Input = CreateBaaSClientIndividualDTOInput;
type Output = CreateClientOutput;

export class CreateNewIndividualClientBaaS implements IUseCase<Input, Result<Output>> {
  constructor(private readonly clientRepository: IClientRepository) { }
  async execute(data: Input): Promise<Result<Output>> {
    const { document, integrationId } = data;
    const integration = await makeGetIntegrationById().execute({
      integrationId: integrationId,
    });

    if (integration.isFail()) {
      return Result.fail(integration.error());
    }

    const existClient = await this.clientRepository.findClientByDocument(document);
    if (existClient.value()) return Result.fail('Cliente já cadastrado')

    const individualBaaS = await makeCompany().requestIndividualByDocument(document, integrationId);
    if (individualBaaS.isFail()) return Result.fail(individualBaaS.error())

    const individual = individualBaaS.value().individual

    const address = individual.address;
    const { phone_number, phone_prefix } = individual.phone;
    const account = individual.aliasAccount;

    const standardServices = await makeGetStandardServices().execute();

    if (standardServices.isFail())
      return Result.fail(standardServices.error());

    const modulesKeys = standardServices.value().data.map((e) => e.key);

    const newClient = Client.create({
      baasId: individual.id,
      integrationId: ID.create(integration.value().id),
      name: individual.fullName,
      email: individual.email,
      document: individual.document.number,
      street: address.street,
      number: address.number,
      complement: address.complement,
      zip: address.zipCode,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      country: address.country,
      approvedDate: individual.approved_date,
      phone: `${phone_prefix}${phone_number}`,
      birthDate: individual.birthDate,
      gender: individual.gender,
      incomeValue: individual.income_value,
      motherName: individual.motherName,
      nationality: individual.nationality,
      nationalityState: individual.nationalityState,
      profession: individual.profession
    });

    if (newClient.isFail()) {
      return Result.fail(newClient.error());
    }

    const clientInstance = newClient.value();

    const newAccount = ClientAccount.create({
      accountNumber: account.account_number,
      accountType: account.account_type,
      baasAccountId: individual.accountId,
      bankNumber: account.bank_number,
      branchNumber: account.branch_number,
      clientId: clientInstance.id,
      branchDigit: account.branch_digit,
    });

    if (newAccount.isFail()) return Result.fail(newAccount.error())

    clientInstance.setAccount(newAccount);

    const createdClient = await this.clientRepository.createClient(
      clientInstance,
      modulesKeys,
    );

    if (createdClient.isFail()) return Result.fail(createdClient.error());

    return Result.Ok({
      ...createdClient.value(),
    });
  }
}