export type File = {
  filename: string;
  content: Buffer;
};

export type SendServiceInvoicesEmailUseCaseDtoInput = {
  clientId: string;
  files: File[];
};
