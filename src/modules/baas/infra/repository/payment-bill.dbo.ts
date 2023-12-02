export type PaymentBillDBO = {
    account_id: string,
    transaction_date: Date,
    transaction_id: string,
    amount: number,
    bar_code: string,
    due_date: Date,
    recipient: {
        name: string,
        document: string
    },
    document: string,
    assignor: string,
    discount: number,
    interest: number,
    status: string,
    payer: {
        name: string,
        document: string
    },
    fine: number
}