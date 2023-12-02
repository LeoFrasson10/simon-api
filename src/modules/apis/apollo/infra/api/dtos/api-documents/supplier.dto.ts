import { ApiProperty } from '@nestjs/swagger';
import { PaginationOutputDTO } from './shared.dto';

class SupplierListItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  document: string;

  @ApiProperty()
  amountLimit: number;

  @ApiProperty()
  partnerCorporateName: string;

  @ApiProperty()
  supplierCorporateName: string;

  @ApiProperty()
  createdAt: Date;
}

export class ListSuppliersResponse extends PaginationOutputDTO {
  @ApiProperty({ type: [SupplierListItem] })
  data: SupplierListItem[];
}
