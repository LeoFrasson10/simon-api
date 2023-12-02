import { Result } from 'types-ddd';
import { User } from '../aggregates';
import {
  DefaultCreateActionOutput,
  DefaultPaginationPropsInput,
  DefaultPaginationPropsOutput,
} from '@shared/types';

export type ListUsersInputFilters = DefaultPaginationPropsInput & {
  document?: string;
  active?: string;
  name?: string;
};

export type ListUsersOutput = DefaultPaginationPropsOutput<User[]>;

export type CreateUserOutput = DefaultCreateActionOutput & {
  name: string;
  email: string;
};

export interface IUserRepository {
  findUserById(id: string): Promise<Result<User>>;
  findUserByEmail(email: string): Promise<Result<User>>;
  createUser(data: User): Promise<Result<CreateUserOutput>>;
  listUsers(filters: ListUsersInputFilters): Promise<Result<ListUsersOutput>>;
  update(user: User): Promise<Result<void>>;
}
