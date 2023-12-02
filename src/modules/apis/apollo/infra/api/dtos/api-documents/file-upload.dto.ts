import { ApiProperty } from '@nestjs/swagger';
import { TrancheStatus } from '../operation-supplier';

export class FilesUploadDTO {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: any[];
}

export class FileUploadDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
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

class InvoiceUpload {
  @ApiProperty()
  filename: string;
  @ApiProperty()
  amount: string;
  @ApiProperty()
  dueDate: string;
  @ApiProperty()
  number: string;
  @ApiProperty()
  invoiceType: string;

}

export class UploadFixInvoice extends FileUploadDTO{
  @ApiProperty({type: [TrancheItem]})
  tranches: TrancheItem[]
}

export class UploadInvoiceCTEorNFSe extends FilesUploadDTO {
  @ApiProperty({ type: [InvoiceUpload] })
  invoices: InvoiceUpload[];
}

enum InvoiceFixSituationStatus {
  sent = 'sent',
  error = 'error',
  unmappedError = 'unmappedError',
}

class InvoiceFixSituation {
  @ApiProperty()
  fixId?: string;
  @ApiProperty()
  filename: string;
  @ApiProperty({ enum: InvoiceFixSituationStatus })
  status: InvoiceFixSituationStatus;
  @ApiProperty()
  details?: string;
}

export class UploadInvoiceFixResponse {
  @ApiProperty({ type: [InvoiceFixSituation] })
  fixed: InvoiceFixSituation[];
}


export class CreateInvoiceFixDTORequest extends FileUploadDTO {
  @ApiProperty()
  fixRequested: string;
  @ApiProperty()
  dueDateRequested: string;
  @ApiProperty()
  amountRequested: string;
  @ApiProperty({type: [TrancheItem]})
  tranches: TrancheItem[]
}



