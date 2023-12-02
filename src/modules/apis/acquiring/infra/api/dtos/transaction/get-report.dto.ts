export type GetTransactionsReportRequest = {
  startDate: string;
  endDate: string;
};

export type GetTransactionsReportByPaymentMethodRequest = {
  startDate: string;
  endDate: string;
  paymentMethod: string;
  page?: number;
  limit?: number;
};
