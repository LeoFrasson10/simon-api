export type ApolloExportOperationSupplierInvoicesPayerDTORequest = {
  supplierDocument?: string;
  invoiceNumber?: string;
  confirmationDateStart?: string;
  confirmationDateEnd?: string;
  status?: string;
};

export type ApolloExportOperationSupplierInvoicesPayerDTOResponse = {
  data: DataItem[];
};

export type ApolloExportOperationSupplierInvoicesPortalDTOResponse = {
  data: DataItem[];
};

type DataItem = {
  id: string;
  status: string;
  supplierDocument: string;
  supplierCorporateName: string;
  invoiceKey?: string;
  invoiceNumber: string;
  invoiceAmount: number;
  dueDate: string;
  emissionDate: string;
  confirmationDate: string;
  approvedAt?: string;
  approvedBy?: string;
};
