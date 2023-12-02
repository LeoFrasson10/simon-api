import { Result } from 'types-ddd';
import { IApolloInvoiceXLSXProvider, IGenerateToBufferData } from '../models';
import { IDateProvider } from '@shared/providers/date';
import * as xlsx from 'xlsx';
import { formatCNPJNumber } from '@shared/helpers';

export class ApolloInvoiceXLSXProvider implements IApolloInvoiceXLSXProvider {
  constructor(private readonly dateProvider: IDateProvider) {}

  async generateToBuffer({
    data,
    consultationDate,
    fieldMapping,
  }: IGenerateToBufferData): Promise<Result<Buffer>> {
    const statusLabel = {
      awaiting: 'Aguardando aprovação',
      canceled: 'Cancelada',
      paid: 'Paga',
      approved: 'Aprovada',
      refused: 'Recusada',
      fixed: 'Correção realizada',
      fix_requested: 'Correção solicitada',
      liquidated: 'Liquidada',
    };

    const columns = Object.values(fieldMapping) as string[];

    const translatedData = data.map((item) => {
      const translatedItem = {};
      for (const key in item) {
        const field = fieldMapping[key];

        if (field) {
          if (key === 'supplierDocument' || key === 'payerDocument') {
            translatedItem[fieldMapping[key]] = {
              v: formatCNPJNumber(item[key]),
            };
          } else if (key === 'status') {
            translatedItem[fieldMapping[key]] = {
              v: statusLabel[item[key]],
            };
          } else {
            translatedItem[fieldMapping[key]] = item[key];
          }
        }
      }
      return translatedItem;
    });

    const worksheet = xlsx.utils.json_to_sheet(translatedData, {
      header: columns,
      dateNF: fieldMapping.invoiceAmount,
    });

    const workbook = xlsx.utils.book_new();
    const sheetName = this.dateProvider.maskDate({
      date: consultationDate ? new Date(consultationDate) : new Date(),
      mask: 'dd-MM-yyyy',
    });

    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });

    return Result.Ok(excelBuffer);
  }
}
