export type GetServiceClientUseCaseDTOInput = {
  id?: string;
};

export type GetServiceClientUseCaseDTOOutput = Client;

type Client = {
  id: string;
  keys: string[];
  clientId?: string;

  createdAt: Date;
  updatedAt: Date;
};
