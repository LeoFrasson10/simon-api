export type GenerateClientContractUseCaseDTOInput = {
  contractId: string;
  client?: {
    name: string;
    email: string;
    accountNumber: string;
    address: string;
    zip: string;
    neighborhood: string;
    document: string;
    city: string;
    state: string;
    branches: string[];
  };
  file?: Express.Multer.File;
};

export type GenerateClientContractUseCaseDTOOutput = {
  filename: string;
  zipBuffer: string;
  path: string;
};

export type FilesToConvert = {
  filename: string;
  docxBuf: Buffer;
};
