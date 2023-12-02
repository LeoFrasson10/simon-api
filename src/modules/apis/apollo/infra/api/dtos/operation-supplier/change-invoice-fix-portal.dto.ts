export type ApolloChangeInvoiceFixPortalDTORequest = {
  fixCorrection: string;
  fixDescription: string;
  fixEventDate: string;
  fixEventType: string;
  fixEventSeqNumber: number;
  fixProtocolNumber: string;
  tranches: {
    amount: number;
    status: string;
    dueDate: Date;
    trancheNumber: number;
  }[];
  observations?: string;
};
