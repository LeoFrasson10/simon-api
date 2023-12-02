export type IndividualItemListModal = {
    id: string,
    fullName: string,
    documentName: string,
    status: string,
    document: {
        number: string,
        type: string
    },
    email: string,
    createdAt: Date,
    updatedAt: Date
};

export type IndividualModalResponse = {
    docs: IndividualItemListModal[];
    totalDocs: number;
    limit: number;
    page: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    totalPages: number;
    prevPage: number;
    nextPage: number;
};
