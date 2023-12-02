export type GetBaaSIndividualUseCaseDTOInput = {
  search: string;
};

export type GetBaaSIndividualUseCaseDTOOutput = {
  data: {
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
  }[];
};
