import { AccountCompany } from './account-company.dto';

export type CompanyModal = {
  _id: string;
  accountId: string;
  externalAccountID: string;
  externalAliasAccount: AccountCompany;
  alias_account?: AccountCompany;
  companyType: string;
  companySubject: string;
  companyNature: string;
  companyName: string;
  documentNumber: string;
  companyEmail: string;
  status: string;
  openingDate: Date;
  monthlyInvoicing: number;
  partnersPF: PartnersPFBaaS[];
  partnersPJ: PartnersPJBaaS[];
  exemptStateRegistration: boolean;
  stateRegistration: string;
  phone: {
    countryCode: string;
    area: string;
    phone: string;
    type: string;
  };
  address: {
    street: string;
    number: string;
    complement: string;
    zip: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
  };
  operators: OperatorBaaS[];
  approved_date: Date;
  promotional_code: string;
};

export type CompanyByDocumentResponse = {
  company: CompanyModal;
};

export type PartnersPFBaaS = {
  fullName: string;
  documentNumber: string;
  birthdayDate: Date;
  phone: {
    countryCode: string;
    area: string;
    phone: string;
    type: string;
  };
  address: {
    street: string;
    number: string;
    complement: string;
    zip: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
  };
};

export type PartnersPJBaaS = {
  documentNumber: string;
  companyName: string;
};

export type OperatorBaaS = {
  _id: string;
  document: string;
  name: string;
  email: string;
  permission: string;
  blocked: boolean;
};
