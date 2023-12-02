import { GetTransactionsReportByPaymentMethodUseCase } from '../../usecases';

export const makeGetTransactionsReportByPaymentMethod =
  (): GetTransactionsReportByPaymentMethodUseCase =>
    new GetTransactionsReportByPaymentMethodUseCase();
