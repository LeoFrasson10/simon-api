import { Aggregate, Result } from "types-ddd";


type PaymentBillProps = {
    clientDocument: string
    payerName: string;
    payerDocument: string;
    assignorName: string;
    status: PaymentBillStatus;
    dueDate: Date;
    transactionDate: Date;
    amount: number;
    assignorDocument: string;
    barCode: string;
    discount: number;
    interest: number;
    fine: number;
}
export enum PaymentBillStatus {
    accomplished = 'Realizada',
    returned = 'Devolvida'
}

export class PaymentBill extends Aggregate<PaymentBillProps> {
    constructor(props: PaymentBillProps) {
        super(props);
    }

public static create(props: PaymentBillProps): Result<PaymentBill> {
        return Result.Ok(new PaymentBill(props))
    }
}