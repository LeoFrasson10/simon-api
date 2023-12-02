import { Result } from 'types-ddd';
import {
  AccountCompanyResponse,
  BaaSPlansOutput,
  ChangePlanAccountInputRequest,
  ChangePlanAccountResponse,
  CompanyByDocumentResponse,
  CompanyModal,
  CompanyModalResponse,
  IndividualByDocumentResponse,
  IndividualModal,
  IndividualModalResponse,
} from '../implementations/dtos';

export type CompanyResponse = CompanyByDocumentResponse;

export interface IBaaS {
  requestCompanyByDocument(
    document: string,
    integrationId?: string,
  ): Promise<Result<CompanyResponse>>;
  requestIndividualByDocument(
    search: string,
    integrationId?: string,
  ): Promise<Result<IndividualByDocumentResponse>>;
  getBaaSAccountById(
    baasAccountId: string,
    integrationId?: string,
  ): Promise<Result<AccountCompanyResponse>>;
  getCompanyById(
    baasId: string,
    integrationId?: string,
  ): Promise<Result<CompanyModal>>;
  getIndividualById(
    baasId: string,
    integrationId?: string
  ): Promise<Result<IndividualByDocumentResponse>>;
  searchCompany(
    search: string,
    integrationId?: string,
  ): Promise<Result<CompanyModalResponse>>;

  listCompanies(
    page: number,
    limit: number,
    integrationId?: string,
  ): Promise<Result<CompanyModalResponse>>;
  listPlans(integrationId?: string): Promise<Result<BaaSPlansOutput>>;
  listIndividual(
    page: number,
    limit: number,
    integrationId?: string,): Promise<Result<IndividualModalResponse>>;
  changePlanOfAccounts(
    data: ChangePlanAccountInputRequest,
    integrationId?: string,
  ): Promise<Result<ChangePlanAccountResponse>>;
}
