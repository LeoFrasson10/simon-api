import { PaginationUseCaseInput, PaginationUseCaseOutput } from "@shared/types";

export type ListPaymentBillsUseCaseDTOInput =
    PaginationUseCaseInput<{
        economicGroupId: string;
        document: string;
        status: string;
    }>;

export type ListPaymentBillUseCaseDTOOutput = PaginationUseCaseOutput<PaymentBillDTOOutpu>;

type PaymentBillDTOOutpu = {
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


