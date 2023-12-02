import { PartnerDTO } from './create-operation.dto';

export type CreateOperationModalDTO = {
  email: string;
  document: string;
  phone: string;
  address: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  bankCode: string;
  agency: string;
  account: string;
  amount: number;
  totalAmount?: number;
  tranches: number;
  partners: PartnerDTO[];
  ipAddress: string;
  timezone: string;
};

export type CreateOperationClientDTO = {
  email: string;
  document: string;
  phone: string;
  address: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  bankCode: string;
  agency: string;
  account: string;
  amount: number;
  totalAmount?: number;
  tranches: number;
  ownerAccount: PartnerDTO;
  ipAddress: string;
  timezone: string;
};
