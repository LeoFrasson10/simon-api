export type GetServicesUseCaseDTOInput = {
  keys: string[];
};

export type GetServicesUseCaseDTOOutput = Service[];

type Service = {
  id: string;
  name: string;
  active: boolean;
  key: string;
  standard: boolean;
  label: string;
  createdAt: Date;
  updatedAt: Date;
};
