import { PartnerDTO, StatusOperation } from './create-operation.dto';

export interface IOperation {
  id?: string;
  email: string;
  borrower_id: string;
  rating_rule_id: string;
  phone: string;
  address: string;
  zip: string;
  city: string;
  state: string;
  complement?: string;
  neighborhood: string;
  bank_code: string;
  agency: string;
  account: string;
  amount: number;
  total_amount: number;
  tranches: number;
  status: StatusOperation;
  partners: PartnerDTO[];
  terms?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  sequential_id?: number;
  ip_address?: string;
  time_zone?: string;
  ccb?: string;
  ccb_code?: string;
  ccb_url?: string;
}

export interface FindAllOperationsParams {
  skip?: number;
  take?: number;
  search?: string;
}

export type FindAllOperationsResponse = {
  count: number;
  operations: IOperation[];
};

export interface ListOperationsDTOResquest {
  page?: number;
  pageSize?: number;
  document?: string;
}
