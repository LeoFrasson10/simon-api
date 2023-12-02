import { IUseCase, Result } from 'types-ddd';
import { makeGetEconomicGroupById } from '@modules/economic-group';
import {
  ListPaymentBillUseCaseDTOOutput,
  ListPaymentBillsUseCaseDTOInput,
} from './dtos';
import { IPaymentBillRepository } from '@modules/baas/domain/repository-interface';

type Input = ListPaymentBillsUseCaseDTOInput;
type Output = ListPaymentBillUseCaseDTOOutput;

export class ListPaymentBills implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly paymentBillsRepository: IPaymentBillRepository,
  ) {}
  async execute(data: Input): Promise<Result<Output>> {
    const { filters, page, pageSize } = data;

    let documentsToFilter: string[] = [];

    if (filters.economicGroupId) {
      const economicGroup = await makeGetEconomicGroupById().execute({
        economicGroupId: filters.economicGroupId,
      });

      if (economicGroup.isFail()) return Result.fail(economicGroup.error());

      if (
        !economicGroup.value().clients ||
        economicGroup.value().clients.length === 0
      )
        return Result.fail(
          'Nenhum cliente encontrado para o grupo econômico informado',
        );

      documentsToFilter = economicGroup.value().clients.map((c) => {
        return c.document;
      });
    } else {
      documentsToFilter = [filters.document];
    }

    const listing = await this.paymentBillsRepository.listPaymnetBills({
      documents: documentsToFilter,
      status: filters.status,
      page,
      pageSize,
    });

    if (listing.isFail()) return Result.fail(listing.error());

    return Result.Ok({
      page,
      pageSize,
      totalRecords: listing.value().totalRecords,
      data: listing.value().data.map((d) => {
        return {
          clientDocument: d.get('clientDocument'),
          payerName: d.get('payerName'),
          payerDocument: d.get('payerDocument'),
          assignorName: d.get('assignorName'),
          status: d.get('status'),
          dueDate: d.get('dueDate'),
          transactionDate: d.get('transactionDate'),
          amount: d.get('amount'),
          assignorDocument: d.get('assignorDocument'),
          barCode: d.get('barCode'),
          discount: d.get('discount'),
          interest: d.get('interest'),
          fine: d.get('fine'),
        };
      }),
    });
  }
}
