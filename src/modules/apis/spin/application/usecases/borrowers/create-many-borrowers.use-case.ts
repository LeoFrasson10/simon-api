import { ProcessBorrowerDTO } from '@modules/apis';
import { services } from '@shared/config';
import { makeHttpClient } from '@shared/providers';

import { IUseCase, Result } from 'types-ddd';
import { makeGetSpinClientByIntegration } from '../../factories';
import { isValidDocument } from '@shared/helpers';
import {
  makeCreateClientIntegration,
  makeGetClientByDocumentAndIntegration,
} from '@modules/client';

type Input = ProcessBorrowerDTO;
type Output = any;

export class ProcessBorrowers implements IUseCase<Input, Result<Output>> {
  public async execute({
    integrationId,
    documents,
  }: Input): Promise<Result<Output>> {
    if (documents.length === 0) {
      return Result.fail('Informar no mínimo um CNPJ');
    }

    const client = await makeGetSpinClientByIntegration().execute({
      integrationId,
    });

    if (client.isFail()) return Result.fail(client.error());

    const newDocuments = [];

    for (const doc of documents) {
      const documentValid = isValidDocument('cnpj', doc.cnpj);
      if (documentValid) {
        const existClient =
          await makeGetClientByDocumentAndIntegration().execute({
            document: doc.cnpj,
            integrationId,
          });

        if (!existClient.isOk()) {
          const newClient = await makeCreateClientIntegration().execute({
            document: doc.cnpj,
            integrationId,
            name: doc.companyName,
            monthlyInvoicing: doc.monthlyInvoicing,
          });

          newDocuments.push({
            cnpj: doc.cnpj,
            companyName: doc.companyName,
            monthlyInvoicing: doc.monthlyInvoicing,
            externalClientId: newClient.value().id,
          });
        } else {
          newDocuments.push({
            cnpj: doc.cnpj,
            companyName: doc.companyName,
            monthlyInvoicing: doc.monthlyInvoicing,
            externalClientId: existClient.value().id,
          });
        }
      }
    }

    const borrowers = await makeHttpClient().requestExternalModule({
      url: `${services.baseUrlSpin}/operation/accept-documents/${integrationId}`,
      method: 'post',
      body: { documents: newDocuments },
      module: 'spin',
      integrationId,
    });

    if (borrowers.isFail()) return Result.fail(borrowers.error());

    return Result.Ok(borrowers.value().response);
  }
}
