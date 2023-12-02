export type UpdateClientUseCaseDTOOutput = {
  id: string;
};

export type UpdateClientUseCaseDTOInput = {
  id: string;
  standardServices?: string[];
  establishmentId?: string;
  economicGroupId?: string;
};
