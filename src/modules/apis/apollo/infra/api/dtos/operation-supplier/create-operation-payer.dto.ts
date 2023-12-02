export type ApolloCreateOperationDraweeDTORequest = {
  data: DataRequest[];
};

type DataRequest = {
  invoiceId: string;
  assignorExternalClientId: string;
  bankCode: string;
  agency: string;
  account: string;
};
