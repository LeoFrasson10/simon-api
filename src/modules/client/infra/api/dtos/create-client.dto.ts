import { PartnerTypeEnum } from '@shared/utils';

export type CreateClientPartnerDTO = {
  clientId?: string;
  name: string;
  document: string;
  documentType: PartnerTypeEnum;
  birthday_date?: Date;
  phone?: string;
  street?: string;
  number?: string;
  complement?: string;
  zip?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
};

export type CreateClientOperatorDTO = {
  clientId?: string;
  name: string;
  document: string;
  email: string;
  blocked: boolean;
  permission: string;
};

export type CreateClientAccountDTO = {
  clientId?: string;
  baasAccountId: string;
  accountNumber: string;
  accountType: string;
  bankNumber: string;
  branchDigit?: string;
  branchNumber: string;
};

export type CreateClientDTO = {
  integrationId: string;
  economicGroupId?: string;
  moduleClientId: string;
  baasId: string;
  name: string;
  email: string;
  document: string;
  type: string;
  subject: string;
  nature: string;
  exemptStateRegistration?: boolean;
  stateRegistration?: string;
  street: string;
  number: string;
  complement?: string;
  zip: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  openingDate: Date;
  monthlyInvoicing: number;
  phone: string;
  standardServices?: string[];
  partnersPF?: CreateClientPartnerDTO[];
  partnersPJ?: CreateClientPartnerDTO[];
  operators: CreateClientOperatorDTO[];
  account?: CreateClientAccountDTO;
  establishmentId?: string;
};

export type CreateClientByIntegrationDTO = {
  monthlyInvoicing: number;
  integrationId: string;
  name: string;
  document: string;
  standardServices?: string[];
  establishmentId?: string;
  phone?: string;
  street?: string;
  number?: string;
  complement?: string;
  zip?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  email?: string;
};
