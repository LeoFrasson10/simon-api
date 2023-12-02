import { IUseCase, Result } from "types-ddd";
import { GetClientFromBaaSUseCaseInput, GetClientFromBaaSUseCaseOutput } from "./dtos";
import { removeSpecialCharacters } from "@shared/helpers";
import { makeCompany } from "@shared/providers";

type Input = GetClientFromBaaSUseCaseInput;
type Output = GetClientFromBaaSUseCaseOutput;

export class GetClientFromBaaSByDocument implements IUseCase<Input, Result<Output>>{
  async execute(data: Input): Promise<Result<Output>> {
    const { document } = data;
    const documentOnlyNumbers = removeSpecialCharacters(document);

    if (documentOnlyNumbers.length === 14) {
      const companyResult = await makeCompany().requestCompanyByDocument(document);
      if (companyResult.isFail()) return Result.fail(companyResult.error())

      const companyInstance = companyResult.value().company;

      return Result.Ok({
        document: companyInstance.documentNumber,
        email: companyInstance.companyEmail,
        name: companyInstance.companyName,
        address: {
          zip: companyInstance.address.zip,
          city: companyInstance.address.city,
          state: companyInstance.address.state,
          number: companyInstance.address.number,
          street: companyInstance.address.street,
          country: companyInstance.address.country,
          complement: companyInstance.address.complement,
          neighborhood: companyInstance.address.neighborhood
        }
      })
    }

    const individualResponse = await makeCompany().requestIndividualByDocument(document);

    if (individualResponse.isFail()) return Result.fail(individualResponse.error())

    const individualInstance = individualResponse.value().individual;

    return Result.Ok({
      document: individualInstance.document.number,
      email: individualInstance.email,
      name: individualInstance.fullName,
      address: {
        zip: individualInstance.address.zipCode,
        city: individualInstance.address.city,
        state: individualInstance.address.state,
        number: individualInstance.address.number,
        street: individualInstance.address.street,
        country: individualInstance.address.country,
        complement: individualInstance.address.complement,
        neighborhood: individualInstance.address.neighborhood
      }
    })
  }
}