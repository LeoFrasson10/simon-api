export type GetBalancesDTOParams = {
  documents?: string;
};

export type GetBalancesDTOResponse = Balance[];

type Balance = {
  name: string;
  balance: number;
  document: string;
  last_update: string;
};
