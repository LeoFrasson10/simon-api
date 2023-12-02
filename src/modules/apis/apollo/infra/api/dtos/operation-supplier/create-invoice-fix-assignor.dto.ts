export type ApolloCreateInvoiceFixAssignorDTORequest = {
  invoiceId: string;
  fixRequested: string;
  tranches?: string
};


export type ApolloCreateInvoiceFixTranche = {
  amount: number;
  status: TrancheStatus;
  dueDate: Date
  trancheNumber: number
}

enum TrancheStatus {
  pending = 'pending',
  liquidated = 'liquidated',
  overdue = 'overdue',
  canceled = 'canceled',
}
export type ApolloCreateInvoiceFixAssignorDTOResponse = {
  details: any;
  emailData: {
    invoiceNumber: string;
    invoiceKey: string;
  };
};
