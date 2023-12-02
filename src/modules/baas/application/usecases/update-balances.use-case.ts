import { IUseCase, Result } from 'types-ddd';
import {
  UpdateAccountBalancesUseCaseDTOInput,
  UpdateAccountBalancesUseCaseDTOOutput,
} from './dtos';
import { ILois } from '@shared/providers';
import { isValidDocument } from '@shared/helpers';

type Input = UpdateAccountBalancesUseCaseDTOInput;
type Output = UpdateAccountBalancesUseCaseDTOOutput;

export class UpdateAccountsBalances implements IUseCase<Input, Result<Output>> {
  constructor(private readonly loisProvider: ILois) {}
  public async execute({ documents }: Input): Promise<Result<Output>> {
    if (!documents || documents.length === 0) {
      return Result.fail('Informe no mínimo 1 CNPJ');
    }

    for (const doc of documents) {
      const isValid = isValidDocument('cnpj', doc);

      if (!isValid) {
        return Result.fail(`${doc} inválido`);
      }
    }

    const updated = await this.loisProvider.updateBalances({
      documents: documents,
    });

    if (updated.isFail()) return Result.fail(updated.error());

    const listing = await this.loisProvider.getBalances({
      documents: documents.join(','),
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
