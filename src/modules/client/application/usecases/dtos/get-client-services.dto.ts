export type GetClientServicesUseCaseDTOInput = {
  clientId?: string;
};

export type GetClientServicesUseCaseDTOOutput = {
  actions: ActionsType[];
};

export type ActionsType = {
  label: string;
  isActive: boolean;
  key: string;
};
