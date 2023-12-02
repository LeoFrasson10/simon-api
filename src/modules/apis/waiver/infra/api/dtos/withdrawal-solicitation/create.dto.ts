export type CreateWithdrawalSolicitationDTO = {
  id?: string;
  clientId: string;
  settlementDate: Date;
  totalAmount?: number;
  clientsAccounts: {
    clientId: string;
    amount: number;
  }[];
};
