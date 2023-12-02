import { Request } from 'express';

interface CustomRequest extends Request {
  integrationId?: string;
  clientId?: string;
  userId?: string;
  userPartnerId?: string;
  assignorId?: string;
  supplierAssignorId?: string;
  sputnikSupplierId?: string;
}

export { CustomRequest };
