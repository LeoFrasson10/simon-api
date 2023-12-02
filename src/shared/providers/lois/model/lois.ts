import { Result } from 'types-ddd';
import {
  CreateClientDTORequest,
  CreateClientDTOResponse,
  CreateClientsDTORequest,
  CreateClientsDTOResponse,
  GetBalancesDTOParams,
  GetBalancesDTOResponse,
  GetClientsDTOParams,
  GetClientsDTOResponse,
  UpdateBalancesDTORequest,
  UpdateBalancesDTOResponse,
} from '../implementations/dtos';

export interface ILois {
  getBalances(
    filters?: GetBalancesDTOParams,
  ): Promise<Result<GetBalancesDTOResponse>>;
  updateBalances(
    data: UpdateBalancesDTORequest,
  ): Promise<Result<UpdateBalancesDTOResponse>>;

  getClients(
    filters?: GetClientsDTOParams,
  ): Promise<Result<GetClientsDTOResponse>>;
  createClients(
    data: CreateClientsDTORequest,
  ): Promise<Result<CreateClientsDTOResponse>>;

  createClient(
    data: CreateClientDTORequest,
  ): Promise<Result<CreateClientDTOResponse>>;
}
