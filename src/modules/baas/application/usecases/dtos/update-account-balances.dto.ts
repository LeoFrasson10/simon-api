export type UpdateAccountBalancesUseCaseDTOInput = {
  documents: string[];
};

export type UpdateAccountBalancesUseCaseDTOOutput = {
  data: Balance[];
};

type Balance = {
  name: string;
  balance: number;
  document: string;
  lastUpdate: string;
};
