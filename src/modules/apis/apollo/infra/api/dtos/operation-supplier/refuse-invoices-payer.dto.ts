export type ApolloRefuseInvoicesPayerDTORequest = {
  invoices: {
    id: string;
    description: string;
  }[];
  userId: string;
};
