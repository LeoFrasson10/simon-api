export type SputnikChangeInvoicePortalDtoRequest = {
  id: string;
  dueDate: string;
  amount: number;
  amountReleased: number;
  payerCorporateName: string;
  supplierCorporateName: string;
  documentPayer: string;
  documentSupplier: string;
  key: string;
  emissionDate: Date;
  serialNumber: string;
  number: number;
  status: string;
  tranches: TrancheDtoRequest[];
};

type TrancheDtoRequest = {
  amount: number;
  status: string;
  dueDate: string;
  number: number;
};
