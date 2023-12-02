type Contact = {
  name: string;
  position: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email: string;
  note?: string;
};

export type CreateEconomicGroupDTORequest = {
  name: string;
  active?: boolean;
  note?: string;
  contacts: Array<Contact>;
};
