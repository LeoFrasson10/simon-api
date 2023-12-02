export type ApolloUploadInvoicesUnmappedWithFileDTORequest = {
  number: string;
  dueDate: Date;
  amount: number;
  invoiceType: string;
  file?: {
    fieldname: string;
    originalname: string;
    mimetype: string;
    buffer: Buffer;
  };
}[];

export type ApolloUploadInvoicesUnmappedDTORequest = {
  number: string;
  dueDate: Date;
  amount: number;
  filename: Buffer;
}[];
