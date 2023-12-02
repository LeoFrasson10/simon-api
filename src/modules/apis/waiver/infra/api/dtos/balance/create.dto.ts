export type CreateWaiverBalanceToClientDTO = {
  valueCredit: number;
  valueDebt: number;
  balanceDate: string;
  balanceAmount: number;
  balanceAmountReceivable: number;
  clientId?: string;
  userId: string;
};
