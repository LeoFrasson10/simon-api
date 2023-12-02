import { PaymentBillDBO } from '@modules/baas/infra/repository';
import { IAdapter, Result } from 'types-ddd';
import {
  PaymentBill,
  PaymentBillStatus,
} from '../aggregates/payment-bill.aggregate';

export class AdapterPaymentBillDBOToDomain
  implements IAdapter<PaymentBillDBO, PaymentBill>
{
  build(data: PaymentBillDBO): Result<PaymentBill> {
    const amountToReal = Number(data.amount) / 100;

    const paymentBill = PaymentBill.create({
      clientDocument: data.document,
      payerName: data.payer.name,
      payerDocument: data.payer.document,
      assignorName: data.assignor,
      status: data.status as PaymentBillStatus,
      dueDate: data.due_date,
      transactionDate: data.transaction_date,
      amount: amountToReal,
      assignorDocument: data.recipient.document,
      barCode: data.bar_code,
      discount: data.discount,
      interest: data.interest,
      fine: data.fine,
    });

    if (paymentBill.isFail()) return Result.fail(paymentBill.error());

    return Result.Ok(paymentBill.value());
  }
}
