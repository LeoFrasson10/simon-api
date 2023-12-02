export type PartnerResponse = {
  id: string;
  name: string;
  document: string;
};

export type TranchesResponse = {
  id: string;
  billetTypeableCode: string;
  billetDueDate: Date;
  value: number;
  trancheNumber: number;
  status: string;
};
export type OperationClientResponse = {
  account: string;
  operationTranches: TranchesResponse[];
  partners: PartnerResponse[];
  companyName: string;
  document: string;
  amount: number;
  rate: string;
  address: string;
  agency: string;
  bankCode: string;
  ccb: string;
  ccbCode: string;
  ccbUrl: string;
  city: string;
  complement: string;
  email: string;
  id: string;
  phone: string;
  state: string;
  status: string;
  ipAddress: string;
  totalAmount: number;
  tranches: number;
  neighborhood: string;
  zip: string;
  createdAt: Date;
  updatedAt: Date;
};
