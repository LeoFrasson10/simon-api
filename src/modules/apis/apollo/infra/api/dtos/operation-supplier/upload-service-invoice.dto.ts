export type ApolloLUploadServiceInvoicesDTORequest = {
  invoiceType: string;
  files?: {
    fieldname: string;
    originalname: string;
    mimetype: string;
    buffer: string;
  }[];
};

export enum InvoiceType {
  product = 'product',
  service = 'service',
  cte = 'cte',
}
