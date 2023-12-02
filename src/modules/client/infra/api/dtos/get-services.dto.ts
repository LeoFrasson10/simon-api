export type ClientServicesDTOResponse = {
  hasActions: ActionsType[];
};

export type ActionsType = {
  label: string;
  isActive: boolean;
  key: string;
};
