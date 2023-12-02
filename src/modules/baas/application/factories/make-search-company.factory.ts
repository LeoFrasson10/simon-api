import { SearchBaaSCompany } from '../usecases';

export const makeSearchBaaSCompany = (): SearchBaaSCompany =>
  new SearchBaaSCompany();
