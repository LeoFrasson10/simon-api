import { PaymnetBillRepository } from '@modules/baas/infra/repository';
import { ListPaymentBills } from '../usecases';

export const makeListPaymentBills = (): ListPaymentBills =>
    new ListPaymentBills(new PaymnetBillRepository());
