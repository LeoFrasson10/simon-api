export type GetEconomicGroupUseCaseDTOInput = {
  economicGroupId?: string;
};

export type GetEconomicGroupUseCaseDTOOutput = EconomicGroup;

type EconomicGroup = {
  id: string;
  name: string;
  active: boolean;
  contacts: EconomicGroupContact[];
  createdAt: Date;
  updatedAt: Date;
  clients?: Client[];
};

type EconomicGroupContact = {
  id: string;
  name: string;
  position: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
};

type Client = {
  id: string;
  name: string;
  document: string;
  establishmentId: string;
};
