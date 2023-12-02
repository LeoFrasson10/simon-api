import { PartnerTypeEnum } from '@shared/utils';

type CreateClientPartnerUseCaseDTOInput = {
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

type CreateClientOperatorUseCaseDTOInput = {
  clientId?: string;
  name: string;
  document: string;
  email: string;
  blocked: boolean;
  permission: string;
};

type CreateClientAccountUseCaseDTOInput = {
  clientId?: string;
  baasAccountId: string;
  accountNumber: string;
  accountType: string;
  bankNumber: string;
  branchDigit?: string;
  branchNumber: string;
};

export type CreateClientUseCaseDTOInput = {
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
  approvedDate: Date;
  monthlyInvoicing: number;
  phone: string;
  standardServices?: string[];
  partnersPF?: CreateClientPartnerUseCaseDTOInput[];
  partnersPJ?: CreateClientPartnerUseCaseDTOInput[];
  operators: CreateClientOperatorUseCaseDTOInput[];
  account?: CreateClientAccountUseCaseDTOInput;
  establishmentId?: string;
};

export type CreateClientByIntegrationUseCaseDTOInput = {
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

export type CreateClientUseCaseDTOOutput = {
  id: string;
  name: string;
  document: string;
  monthlyInvoicing: number;
  integrationId: string;
  email?: string;
  phone?: string;
  serviceClient?: {
    id: string;
    modulesKeys: string[];
  };
};
