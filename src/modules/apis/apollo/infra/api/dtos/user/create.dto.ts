export type CreateApolloUserDTORequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  document: string;
  active?: boolean;
  partnerId: string;
};

export type CreateApolloUserDTOResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    document: string;
    active: boolean;
    partnerId?: string;
    partner?: {
      id: string;
      name: string;
    };
    createdAt: Date;
  };
  temporaryPassword: string;
};
