export type CreateEconomicGroupUseCaseDTOInput = {
  name: string;
  active?: boolean;
  note?: string;
  contacts: Array<Contact>;
};

export type CreateEconomicGroupUseCaseDTOOutput = {
  id: string;
};

type Contact = {
  name: string;
  position: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email: string;
  note?: string;
};
