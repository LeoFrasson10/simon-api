export type FirstAccessUserUseCaseDTOInput = {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
  userId: string;
};

export type FirstAccessUserUseCaseDTOOutput = {
  id: string;
  name: string;
  email: string;
  document: string;
  active: boolean;
  createdAt: Date;
};
