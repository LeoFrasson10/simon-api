import { AzureFileBuckteProvider } from '../implementations/azure-file-bucket';
import { IFileBucketProvider } from '../models';

export const makeAzureFileBucketProvider = (): IFileBucketProvider =>
    new AzureFileBuckteProvider()