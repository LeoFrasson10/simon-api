import { AcceptDocs, CreateOperationDTO } from '@modules/apis';
import { Result } from 'types-ddd';

export interface ISpinRepository {
  createOperation(data: CreateOperationDTO): Promise<Result<any>>;
  acceptDocuments(data: AcceptDocs): Promise<Result<any>>;
}
