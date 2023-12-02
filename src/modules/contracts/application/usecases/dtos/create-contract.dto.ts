export type CreateContractUseCaseDTOInput = {
  title: string;
  description?: string;
  userId: string;
  file?: Express.Multer.File;
  useSpreadsheet?: string;
};

export type CreateContractUseCaseDTOOutput = {
  id: string;
};
