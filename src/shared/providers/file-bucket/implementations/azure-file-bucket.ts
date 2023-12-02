import { Result } from 'types-ddd';
import { IFile, IFileBucketProvider, IOrigin } from '../models';
import {
  BlobSASPermissions,
  BlobServiceClient,
  SASProtocol,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob';
import { Azure } from '@shared/config';

export class AzureFileBuckteProvider implements IFileBucketProvider {
  private blobServiceClient: BlobServiceClient;

  constructor() {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      Azure.AzureAccountName,
      Azure.AzureAccountKey,
    );

    this.blobServiceClient = new BlobServiceClient(
      Azure.AzureUrl,
      sharedKeyCredential,
    );
  }

  async createFromBuffer(origin: IOrigin<Buffer>): Promise<Result<IFile>> {
    const { fileName, data, prefix } = origin;

    const url = `${prefix}/${fileName}`;
    const containerClient = this.blobServiceClient.getContainerClient(
      Azure.AzureContainerName,
    );
    const blockBlobClient = containerClient.getBlockBlobClient(url);

    await blockBlobClient.upload(data, data.length);

    return Result.Ok({
      fileName: origin.fileName,
      URL: url,
      type: 'Azure',
    });
  }

  async getFileURL(path: string): Promise<Result<string>> {
    if (!path || path === '') return Result.fail('Informe um path válido');

    const containerClient = this.blobServiceClient.getContainerClient(
      Azure.AzureContainerName,
    );
    const blobClient = containerClient.getBlobClient(path);

    const blobExists = await blobClient.exists();
    if (!blobExists) return Result.fail('Arquivo não encontrado');

    const sasOptions = {
      expiresOn: new Date(new Date().valueOf() + 60 * 60 * 1000),
      protocol: SASProtocol.Https,
      containerName: Azure.AzureContainerName,
      permissions: BlobSASPermissions.parse('r'),
    };

    const sharedKeyCredential = new StorageSharedKeyCredential(
      this.blobServiceClient.accountName,
      Azure.AzureAccountKey,
    );

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential,
    ).toString();

    const urlWithSas = `${blobClient.url}?${sasToken.toString()}`;

    return Result.Ok(urlWithSas);
  }

  async getFileBuffer(path: string): Promise<Result<Buffer>> {
    if (!path || path === '') return Result.fail('Informe um path válido');

    const containerClient = this.blobServiceClient.getContainerClient(
      Azure.AzureContainerName,
    );
    const blobClient = containerClient.getBlobClient(path);

    const blobExists = await blobClient.exists();

    if (!blobExists) return Result.fail('Arquivo não encontrado');

    const bufferContent = await blobClient.downloadToBuffer();

    return Result.Ok(bufferContent);
  }
}
