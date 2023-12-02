import { Result } from 'types-ddd';
import { BaaSCallbackDTO, MongooseBaaSCallbacks } from '../db';
import { PaymentBillDBO } from './payment-bill.dbo';
import {
  IPaymentBillRepository,
  ListPaymnetBillsInputFilters,
  ListPaymnetBillsOutput,
} from '@modules/baas/domain/repository-interface';
import { AdapterPaymentBillDBOToDomain } from '@modules/baas/domain/adapters/payment-bill.adapters';
import { PaymentBill } from '@modules/baas/domain/aggregates/payment-bill.aggregate';

export class PaymnetBillRepository implements IPaymentBillRepository {
  async listPaymnetBills(
    filters: ListPaymnetBillsInputFilters,
  ): Promise<Result<ListPaymnetBillsOutput>> {
    const { page, pageSize, documents, status } = filters;

    const mongooseBaaSCallbacks = MongooseBaaSCallbacks.getInstance();
    const callbackModel = mongooseBaaSCallbacks.getModel('baas-callbacks');

    let query = callbackModel.find().select('-__v').where('origin', 'PAYMENT');

    let queryCount = callbackModel.find().count().where('origin', 'PAYMENT');

    if (documents.length > 0) {
      query = query.where('data.document').in(documents);
      queryCount = queryCount.where('data.document').in(documents);
    }

    if (status) {
      query = query.where('data.status').equals(status);
      queryCount = queryCount.where('data.status').equals(status);
    }

    query = query
      .sort({ 'data.transaction_date': -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const dbos: BaaSCallbackDTO<PaymentBillDBO>[] = await query.exec();

    const totalRecords = await queryCount.exec();

    const adapter = new AdapterPaymentBillDBOToDomain();

    const data: PaymentBill[] = [];
    for (const dbo of dbos) {
      const paymentBill = dbo.data;
      const adapted = adapter.build(paymentBill);

      if (adapted.isFail()) return Result.fail(adapted.error());

      data.push(adapted.value());
    }

    return Result.Ok({
      data,
      totalRecords,
    });
  }
}
