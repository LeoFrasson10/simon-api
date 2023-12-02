export type GetContractUseCaseDTOInput = {
  contractId: string;
};

export type GetContractUseCaseDTOOutput = {
  id: string;
  title: string;
  description: string;
  version: number;
  filename: string;
  path: string;
  createdAt: Date;
  useSpreadsheet: boolean;
};
