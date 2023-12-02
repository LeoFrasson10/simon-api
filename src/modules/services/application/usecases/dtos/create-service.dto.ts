export type CreateServiceUseCaseDTOInput = {
  name: string;
  key?: string;
  active?: boolean;
  standard: boolean;
  label: string;
};

export type CreateServiceUseCaseDTOOutput = {
  id: string;
};
