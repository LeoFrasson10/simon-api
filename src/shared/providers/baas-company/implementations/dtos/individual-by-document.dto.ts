export type IndividualModal = {
  id: string,
  accountId: string,
  fullName: string,
  documentName: string,
  nickname: string,
  status: string,
  document: {
    number: string,
    state: string,
    issuanceDate: Date,
    type: string
  },
  gender: string,
  maritalStatus: string,
  email: string,
  motherName: string,
  birthDate: Date,
  nationality: string,
  nationalityState: string,
  approved_date: Date,
  avatar_url: string,
  pep: boolean,
  income_value: number,
  profession: string,
  phone: {
    _id: string,
    phone_prefix: number,
    phone_number: number
  },
  promotional_code: string,
  address: {
    zipCode: string,
    street: string,
    complement: string,
    number: string,
    neighborhood: string,
    city: string,
    state: string,
    country: string
  },
  aliasAccount?: AliasAccount;
  createdAt: Date,
  updatedAt: Date
}

export type IndividualByDocumentResponse = {
  individual: IndividualModal
}

type AliasAccount = {
  bank_name?: string;
  account_digit: string,
  account_number: string,
  account_status: string,
  account_type: string,
  bank_number: string,
  branch_digit: string,
  branch_number: string,
}

export type IndividualAccount = {
  id: string,
  account_number: string,
  email: string,
  individual_id: string,
  company_id: string,
  full_name: string,
  document: string,
  account_type: string,
  status: string,
  status_description: string,
  canceled_date: string,
  blocked: boolean,
  username: string,
  balance: string,
  balance_cents: number,
  last_access: Date,
  avatar_url: string,
  alias_account: AliasAccount;
  external_blocked: boolean,
  created_at: Date,
  updated_at: Date
}
