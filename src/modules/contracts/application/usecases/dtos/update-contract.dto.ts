export type UpdateContractUseCaseDTOInput = {
  contractId: string;
  title: string;
  description?: string;
  userId: string;
  file?: Express.Multer.File;
  useSpreadsheet?: string;
};

export type UpdateContractUseCaseDTOOutput = void;
