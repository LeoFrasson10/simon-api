export type ApolloCreateInvoiceFixDraweeDTORequest = {
  userId: string;
  invoiceId: string;
  fixRequested: string;
  tranches?: {
    amount: number;
    status: TrancheStatus;
    dueDate: string
    trancheNumber: number
  }[]
};
export enum TrancheStatus {
  pending = 'pending',
  liquidated = 'liquidated',
  overdue = 'overdue',
  canceled = 'canceled',
}
export type ApolloCreateInvoiceFixDraweeDTOResponse = {
  id: string;
  externalClientId: string;
  userEmail: string;
  userName: string;
  isSendEmail: boolean;
  emailData: {
    fixType: 'amount' | 'duedate';
    invoiceNewDueDate: string;
    invoiceNewAmount: number;
    invoiceNumber: string;
    invoiceKey: string;
  };
};
