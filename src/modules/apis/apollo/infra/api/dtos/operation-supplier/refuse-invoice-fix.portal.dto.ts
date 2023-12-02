
export type RefuseInvoiceFixPortalDtoRequest = {
    invoiceFixId: string
    observations: string
};


export type RefuseInvoiceFixPortalDtoResponse = {
    invoiceKey: string
    invoiceNumber: string
    assignorCorporateName: string
    tranches: {
        amount: number;
        status: string;
        dueDate: Date;
        trancheNumber: number;
    }[]
}