export type CreateLoisClientUseCaseDTOInput = {
  integrationId: string;
};

export type CreateLoisClientUseCaseDTOOutput = {
  data: {
    details?: string;
    isError?: boolean;
    client?: {
      id: string;
      name: string;
      document: string;
    };
  }[];
};
