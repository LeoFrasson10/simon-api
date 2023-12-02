import { ApiProperty } from '@nestjs/swagger';
import { PaginationOutputDTO } from './shared.dto';
import { TrancheStatus } from '../operation-supplier';

export class ConfirmInvoicesDTO {
  @ApiProperty({ type: [String] })
  invoiceIds: string[];
}

enum Status {
  approved = 'approved',
  refused = 'refused',
  error = 'error',
  unmappedError = 'unmappedError',
}

class InvoiceActionsInvoicesOutput {
  @ApiProperty()
  invoiceId?: string;
  @ApiProperty({ enum: Status })
  status: Status;
  @ApiProperty()
  details?: string;
}

export class InvoiceActionsResponse {
  @ApiProperty({ type: [InvoiceActionsInvoicesOutput] })
  invoices: InvoiceActionsInvoicesOutput[];
}

export class RefusedInvoicesDTO {
  @ApiProperty({ type: [String] })
  invoiceIds: string[];
}

export class ApprovedInvoicesDTO {
  @ApiProperty({ type: [String] })
  invoiceIds: string[];
}

class TrancheItem {
  @ApiProperty()
  amount: number;
  @ApiProperty()
  status: TrancheStatus;
  @ApiProperty()
  dueDate: string
  @ApiProperty()
  trancheNumber: number
}

export class CreateInvoiceFixDTO {
  @ApiProperty()
  fixRequested: string;
  @ApiProperty({type: [TrancheItem]})
  tranches: TrancheItem[]
}

export class CreateInvoiceFixResponse {
  @ApiProperty()
  id: string;
}

class InvoiceFix {
  @ApiProperty()
  id: string;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  createdAt: Date;
}

class Tranche {
  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  trancheNumber: number;
}

class InvoiceItemDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  payerDocument: string;

  @ApiProperty()
  corporateName: string;

  @ApiProperty()
  cfop: string;

  @ApiProperty()
  number: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  invoiceType: string;

  @ApiProperty()
  emissionDate: Date;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  approvedAt?: Date;

  @ApiProperty()
  approvedBy?: string;

  @ApiProperty()
  refusedAt?: Date;

  @ApiProperty()
  refusedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [InvoiceFix] })
  fixes?: InvoiceFix[];
}

export class ListInvoiceAssignorResponse extends PaginationOutputDTO {
  @ApiProperty({ type: [InvoiceItemDTO] })
  data: InvoiceItemDTO[];
}

export class InvoiceAssignorResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  operationId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  amount: number;
  @ApiProperty()
  amountReleased: number;
  @ApiProperty()
  documentPayer: string;
  @ApiProperty()
  payerCorporateName: string;

  @ApiProperty()
  supplierDocument: string;
  @ApiProperty()
  supplierCorporateName: string;

  @ApiProperty()
  key: string;
  @ApiProperty()
  serialNumber: string;
  @ApiProperty()
  number: string;
  @ApiProperty()
  cfop: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  complement: string;
  @ApiProperty()
  neighborhood: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  state: string;
  @ApiProperty()
  zip: string;

  @ApiProperty()
  emissionDate: Date;
  @ApiProperty()
  dueDate: Date;
  @ApiProperty()
  settlementDate: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  filename: string;
  @ApiProperty()
  details: string;
  @ApiProperty()
  refusedDescription?: string;
  @ApiProperty()
  approvedAt?: Date;
  @ApiProperty()
  refusedAt?: Date;
  @ApiProperty()
  refusedBy?: string;
  @ApiProperty()
  approvedBy?: string;

  @ApiProperty({ type: [Tranche] })
  tranches: Tranche[];

  @ApiProperty({ type: [InvoiceFix] })
  fixes?: InvoiceFix[];
}

export class InvoicePayerResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  supplierDocument: string;
  @ApiProperty()
  supplierCorporateName: string;
  @ApiProperty()
  payerDocument: string;
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
  confirmationDate: Date;
  @ApiProperty()
  address?: string;
  @ApiProperty()
  city?: string;
  @ApiProperty()
  state?: string;
  @ApiProperty()
  zip?: string;
  @ApiProperty()
  neighborhood?: string;
  @ApiProperty()
  complement?: string;
  @ApiProperty()
  amountReleased?: number;
  @ApiProperty()
  refusedDescription?: string;
  @ApiProperty()
  approvedAt?: Date;
  @ApiProperty()
  refusedAt?: Date;
  @ApiProperty()
  refusedBy?: string;
  @ApiProperty()
  approvedBy?: string;

  @ApiProperty({ type: [Tranche] })
  tranches?: Tranche[];

  @ApiProperty({ type: [InvoiceFix] })
  fixes?: InvoiceFix[];
}

class InvoicePayerItemDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;
  @ApiProperty()
  supplierId?: string;
  @ApiProperty()
  supplierDocument: string;
  @ApiProperty()
  supplierCorporateName: string;
  @ApiProperty()
  supplierAssignorExternalId?: string;

  @ApiProperty()
  invoiceNumber: string;
  @ApiProperty()
  invoiceCFOP: string;
  @ApiProperty()
  invoiceAmount: number;

  @ApiProperty()
  emissionDate: Date;
  @ApiProperty()
  dueDate: Date;
  @ApiProperty()
  confirmationDate: Date;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  approvedAt?: Date;
  @ApiProperty()
  refusedAt?: Date;

  @ApiProperty()
  approvedBy?: string;
  @ApiProperty()
  refusedBy?: string;

  @ApiProperty({ type: [InvoiceFix] })
  fixes?: InvoiceFix[];
}

export class ListInvoicePayerResponse extends PaginationOutputDTO {
  @ApiProperty({ type: [InvoicePayerItemDTO] })
  data: InvoicePayerItemDTO[];
}

enum SupplierInvoicesSituationOutputStatus {
  approved = 'approved',
  refused = 'refused',
  error = 'error',
  unmappedError = 'unmappedError',
}

class Invoice {
  @ApiProperty()
  id: string;
  @ApiProperty()
  corporateName: string;
  @ApiProperty()
  serialNumber?: string;
  @ApiProperty()
  number?: string;
  @ApiProperty()
  cfop: string;
  @ApiProperty()
  amount: number;

  @ApiProperty()
  emissionDate: Date;
  @ApiProperty()
  dueDate: Date;
  @ApiProperty()
  documentPayer: string;
  @ApiProperty()
  key: string;
  @ApiProperty()
  filename: string;
  @ApiProperty()
  tranches: number;
}

class SupplierInvoicesSituationOutput {
  @ApiProperty()
  invoiceId?: string;
  @ApiProperty()
  filename: string;
  @ApiProperty({ enum: SupplierInvoicesSituationOutputStatus })
  status: SupplierInvoicesSituationOutputStatus;
  @ApiProperty()
  details?: string;
  @ApiProperty({ type: Invoice })
  invoice?: Invoice;
}

export class UploadInvoicesResponse {
  @ApiProperty({ type: [SupplierInvoicesSituationOutput] })
  invoices: SupplierInvoicesSituationOutput[];
}
