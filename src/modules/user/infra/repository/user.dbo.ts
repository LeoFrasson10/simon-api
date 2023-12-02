export type UserDBO = {
  id?: string;
  name: string;
  email: string;
  password: string;
  document: string;
  active: boolean;
  isAdmin: boolean;
  phone?: string;
  created_at?: Date;
  updated_at?: Date;
  first_access: boolean;
  permission: string;
  organization?: string;
};
