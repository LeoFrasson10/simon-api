import { ApiProperty } from '@nestjs/swagger';

export class PaginationOutputDTO {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalRecords: number;
}
