import {
  DefaultPaginationPropsInput,
  DefaultPaginationPropsOutput,
} from '@shared/types';
import { Result } from 'types-ddd';
import { PaymentBill } from '../aggregates/payment-bill.aggregate';

export type ListPaymnetBillsInputFilters = DefaultPaginationPropsInput & {
  documents: string[];
  status: string;
};

export type ListPaymnetBillsOutput = DefaultPaginationPropsOutput<
  PaymentBill[]
>;

export enum PaymentBillStatus {
  accomplished = 'Realizada',
  returned = 'Devolvida',
}

export interface IPaymentBillRepository {
  listPaymnetBills(
    filters: ListPaymnetBillsInputFilters,
  ): Promise<Result<ListPaymnetBillsOutput>>;
}
