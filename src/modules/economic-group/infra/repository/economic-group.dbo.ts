import { DefaultDBOProps } from '@shared/types';

export type EconomicGroupDBO = DefaultDBOProps & {
  name: string;
  note?: string;
  active: boolean;
  contacts: EconomicGroupContactDBO[];
  clients?: ClientDBO[];
};

export type EconomicGroupContactDBO = DefaultDBOProps & {
  name: string;
  position: string;
  primary_phone: string;
  secondary_phone?: string;
  email: string;
  note?: string;
};

type ClientDBO = DefaultDBOProps & {
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
  economic_group?: EconomicGroupDBO;
  establishment_id?: string;
};
