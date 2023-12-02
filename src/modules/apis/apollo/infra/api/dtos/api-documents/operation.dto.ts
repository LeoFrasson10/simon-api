import { ApiProperty } from '@nestjs/swagger';
import { PaginationOutputDTO } from './shared.dto';

class OperationData {
  @ApiProperty()
  invoiceId: string;

  @ApiProperty()
  assignorExternalClientId: string;

  @ApiProperty()
  bankCode: string;

  @ApiProperty()
  agency: string;

  @ApiProperty()
  account: string;
}

export class CreateOperationDTO {
  @ApiProperty({ type: [OperationData] })
  data: OperationData[];
}

enum InvoiceStatus {
  analyzing = 'analyzing',
  processing = 'processing',
  sending = 'sending',
  awaiting = 'awaiting',
  canceled = 'canceled',
  paid = 'paid',
  overdue = 'overdue',
  liquidated = 'liquidated',
  fixRequested = 'fix_requested',
  fixed = 'fixed',
  approved = 'approved',
  refused = 'refused',
}

enum InvoiceType {
  product = 'product',
  service = 'service',
  cte = 'cte',
}

class OperationInvoice {
  @ApiProperty()
  id: string;
  @ApiProperty()
  supplierCorporateName: string;
  @ApiProperty()
  payerCorporateName: string;
  @ApiProperty()
  invoiceNumber: string;
  @ApiProperty()
  invoiceAmount: number;
  @ApiProperty()
  emissionDate: Date;
  @ApiProperty()
  dueDate: Date;
  @ApiProperty()
  invoiceCFOP?: string;

  @ApiProperty({ enum: InvoiceStatus })
  status: InvoiceStatus;

  @ApiProperty()
  trancheNumbers: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ enum: InvoiceType })
  invoiceType: InvoiceType;
}

class OperationsListItem {
  @ApiProperty()
  id: string;
  @ApiProperty()
  sequentialId: string;

  @ApiProperty()
  supplierDocument: string;
  @ApiProperty()
  supplierCorporateName: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  totalAmountOperation: number;
  @ApiProperty()
  releasedAmountOperation: number;
  @ApiProperty()
  invoicesCount: number;

  @ApiProperty()
  greatestDueDateOfInvoices: Date;
  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [OperationInvoice] })
  invoices?: OperationInvoice[];
}

export class ListOperationResponse extends PaginationOutputDTO {
  @ApiProperty({ type: [OperationsListItem] })
  data: OperationsListItem[];
}
