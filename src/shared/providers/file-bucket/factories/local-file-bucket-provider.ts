import { LocalFileBucketProvider } from '../implementations';
import { IFileBucketProvider } from '../models';

export const makeLocalFileBucketProvider = (): IFileBucketProvider =>
  new LocalFileBucketProvider();
