export type ApolloUploadInvoiceFixSupplierDTOResponse = {
  fixed: ApolloSupplierInvoiceFixSituationOutput;
  externalClientId: string;
  emailData: {
    invoiceNumber: string;
    invoiceKey: string;
  };
};

export type ApolloSupplierInvoiceFixSituationOutput = {
  fixId?: string;
  filename: string;
  status: ApolloSupplierInvoiceFixSituationOutputStatus;
  details?: string;
};
export type ApolloUploadInvoiceFixSupplierDTORequest = {
  tranches: string;
}

export type ApolloUploadInvoiceFixTrancheSupplierDTORequest = {
    amount: number;
    status: TrancheStatus;
    dueDate: string
    trancheNumber: number
}

export enum ApolloSupplierInvoiceFixSituationOutputStatus {
  sent = 'sent',
  error = 'error',
  unmappedError = 'unmappedError',
}

enum TrancheStatus {
  pending = 'pending',
  liquidated = 'liquidated',
  overdue = 'overdue',
  canceled = 'canceled',
}
