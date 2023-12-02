import { IUseCase, Result } from 'types-ddd';
import {
  GetAccountBalancesUseCaseDTOInput,
  GetAccountBalancesUseCaseDTOOutput,
} from './dtos';
import { ILois } from '@shared/providers';
import { isValidDocument } from '@shared/helpers';

type Input = GetAccountBalancesUseCaseDTOInput;
type Output = GetAccountBalancesUseCaseDTOOutput;

export class ListAccountsBalances implements IUseCase<Input, Result<Output>> {
  constructor(private readonly loisProvider: ILois) {}
  public async execute(data: Input): Promise<Result<Output>> {
    if (!data.documents) {
      return Result.fail('Informe no mínimo 1 CNPJ');
    }

    const documents = data.documents.split(',');

    if (documents.length === 0) {
      return Result.fail('Informe no mínimo 1 CNPJ');
    }

    for (const doc of documents) {
      const isValid = isValidDocument('cnpj', doc);

      if (!isValid) {
        return Result.fail(`${doc} inválido`);
      }
    }

    const listing = await this.loisProvider.getBalances({
      documents: data.documents,
    });

    if (listing.isFail()) return Result.fail(listing.error());

    return Result.Ok({
      data: listing.value().map((l) => ({
        name: l.name,
        balance: l.balance,
        lastUpdate: l.last_update,
        document: l.document,
      })),
    });
  }
}
