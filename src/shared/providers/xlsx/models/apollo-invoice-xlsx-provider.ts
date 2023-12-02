import { Result } from 'types-ddd';

export type IGenerateToBufferData = {
  data: any[];
  consultationDate: Date;
  fieldMapping: any;
};

export interface IApolloInvoiceXLSXProvider {
  generateToBuffer(data: IGenerateToBufferData): Promise<Result<Buffer>>;
}
