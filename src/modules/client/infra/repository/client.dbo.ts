import { EconomicGroupDBO } from '@modules/economic-group';
import { IntegrationDBO } from '@modules/integrations';
import { ServiceClientDBO } from '@modules/service-client';
import { DefaultDBOProps } from '@shared/types';

export type ClientDBO = DefaultDBOProps & {
  integration_id: string;
  economic_group_id?: string;
  service_client_id?: string;
  baas_id: string;
  name: string;
  email: string;
  document: string;
  type: string;
  subject: string;
  nature: string;
  exempt_state_registration?: boolean;
  state_registration?: string;
  street: string;
  number: string;
  complement?: string;
  zip: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  opening_date: Date;
  approved_date?: Date;
  monthly_invoicing: number;
  phone: string;
  gender?: string;
  motherName?: string;
  birthDate?: Date;
  nationality?: string;
  nationalityState?: string;
  profession?: string;
  income_value?: number;
  integration?: IntegrationDBO;
  economic_group?: EconomicGroupDBO;
  service_client?: ServiceClientDBO;
  establishment_id?: string;
  accounts?: ClientAccountDBO;
  operators?: ClientOperatorsDBO[];
  partners?: ClientPartnerDBO[];
};

export type ClientAccountDBO = DefaultDBOProps & {
  baas_account_id: string;
  account_number: string;
  account_type: string;
  bank_number: string;
  branch_digit: string;
  branch_number: string;
  client_id: string;
};

export type ClientPartnerDBO = DefaultDBOProps & {
  name: string;
  document: string;
  documen_type: string;
  birthday_date?: Date;
  phone?: string;
  street?: string;
  number?: string;
  complement?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: string;
  client_id: string;
};

export type ClientOperatorsDBO = DefaultDBOProps & {
  name: string;
  email: string;
  document: string;
  permission: string;
  blocked: boolean;
  client_id: string;
};

export type ClientAccountPlanDBO = DefaultDBOProps & {
  baas_plan_id: string;
  user_id: string;
  name: string;
  description: string;
  monthly_payment: number;
  client_id: string;
};
