export type ApolloLUploadInvoicesAssignorDTORequest = {
  supplierId: string;
  files?: {
    fieldname: string;
    originalname: string;
    mimetype: string;
    buffer: string;
  }[];
};
