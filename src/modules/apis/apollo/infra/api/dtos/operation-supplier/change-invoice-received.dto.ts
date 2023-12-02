export type ChangeInvoiceReceivedDtoRequest = {
  id: string;
  dueDate: Date;
  amount: number;
  amountReleased: number;
  payerCorporateName: string;
  assignorCorporateName: string;
  documentPayer: string;
  documentAssignor: string;
  key: string;
  emissionDate: Date;
  serialNumber: string;
  number: number;
  cfop: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  neighborhood: string;
  complement: string;
  status: string;
  tranches: TrancheDtoRequest[];
};

export type TrancheDtoRequest = {
  amount: number;
  status: string;
  dueDate: Date;
  trancheNumber: number;
};
