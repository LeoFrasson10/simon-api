import { IUseCase, Logger, Result } from 'types-ddd';

import { ILois } from '@shared/providers';
import { IClientRepository } from '@modules/client';
import { CreateLoisClientUseCaseDTOInput } from './dtos';

type Input = CreateLoisClientUseCaseDTOInput;
type Output = any;

type ClientDocs = {
  id: string;
  document: string;
};

export class CreateLoisClients implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly loisProvider: ILois,
  ) {}
  public async execute(data: Input): Promise<Result<Output>> {
    const clientDocuments: ClientDocs[] = [];

    let pageNumber = 1;
    let isContinue = true;

    while (isContinue) {
      const clients = await this.clientRepository.listClients({
        page: pageNumber,
        pageSize: 99999,
        integrationId: data.integrationId,
      });

      if (clients.isFail()) {
        Result.fail(clients.error());
        break;
      }

      const response = clients.value();
      const docs = response.data.map((i) => ({
        document: i.get('document'),
        id: i.id.value(),
      }));

      clientDocuments.push(...docs);

      pageNumber = pageNumber + 1;
      if (response.totalRecords === clientDocuments.length) {
        isContinue = false;
      }
    }

    let loisPageNumber = 1;
    let isContinueLois = true;

    const docsToSearch = clientDocuments.map((c) => c.document).join(',');
    const clientExists: string[] = [];

    while (isContinueLois) {
      const clients = await this.loisProvider.getClients({
        page: loisPageNumber,
        pageSize: 99999,
        document: docsToSearch,
      });

      if (clients.isFail()) {
        Result.fail(clients.error());
        break;
      }

      const response = clients.value();

      clientExists.push(...response.data.map((i) => i.document));

      loisPageNumber = loisPageNumber + 1;
      if (response.totalRecords === clientExists.length) {
        isContinueLois = false;
      }
    }

    const clientsDocsToCreate = clientDocuments.filter(
      (cli) => !clientExists.includes(cli.document),
    );

    for await (const client of clientsDocsToCreate) {
      const getClient = await this.clientRepository.findClientById(client.id);

      if (getClient.isOk()) {
        const newClientInstanceToCreate = getClient.value();

        const createdClientResponse = await this.loisProvider.createClient({
          ...newClientInstanceToCreate.toObject(),
          account: newClientInstanceToCreate
            .get('accounts')
            ?.value()
            .toObject(),
          operators: newClientInstanceToCreate
            .get('operators')
            .map((op) => op.value().toObject()),
          partners: newClientInstanceToCreate
            .get('partners')
            .map((p) => p.value().toObject()),
        });

        if (createdClientResponse.isFail()) {
          Logger.error(createdClientResponse.error());
          continue;
        }

        Logger.info(
          `[LOIS] Cliente criado: ${JSON.stringify(
            createdClientResponse.value(),
          )}`,
        );
      }
    }

    return Result.Ok('Base atualizada');
  }
}
