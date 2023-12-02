export type SputnikCreateUserDTORequest = {
  name: string;
  email: string;
  document: string;
  partnerId: string;
};

export type SputnikCreateUserDTOResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    document: string;
    active: boolean;
    createdAt: Date;
    partner?: {
      id: string;
      name: string;
    };
  };
  temporaryPassword: string;
};
