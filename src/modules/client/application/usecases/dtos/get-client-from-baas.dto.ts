export type GetClientFromBaaSUseCaseInput = {
  document: string;
}

export type GetClientFromBaaSUseCaseOutput = {
  document: string;
  name: string;
  email: string;
  address: {
    city: string;
    complement: string;
    country: string;
    neighborhood: string;
    number: string;
    state: string;
    street: string;
    zip: string;
  }
}