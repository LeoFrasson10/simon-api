export type GetServiceUseCaseDTOInput = {
  serviceId?: string;
};

export type GetServiceUseCaseDTOOutput = {
  id: string;
  name: string;
  active: boolean;
  key: string;
  standard: boolean;
  createdAt: Date;
  updatedAt: Date;
};
