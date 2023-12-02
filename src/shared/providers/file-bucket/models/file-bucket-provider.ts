import { Blob } from 'buffer';
import { Result } from 'types-ddd';

export type IOrigin<T> = {
  fileName?: string;
  fileExtension?: FileType;
  data?: T;
  prefix?: string;
};

export enum FileType {
  CSV = 'csv',
  JPG = 'jpg',
  XML = 'xml',
  PDF = 'pdf',
  DOCX = 'docx',
}

export type IFile = {
  URL?: string;
  fileName: string;
  type: 'local' | 'aws' | 'Azure';
};

export type IMoveFile = {
  sourcePath: string;
  fileName?: string;
  fileExtension: FileType;
  prefix?: string;
};

export interface IFileBucketProvider {
  createFromBlob?(origin: IOrigin<Blob>): Promise<Result<IFile>>;
  createFromBuffer?(origin: IOrigin<Buffer>): Promise<Result<IFile>>;
  getFileURL?(path: string): Promise<Result<any>>;
  getFileBuffer?(path: string): Promise<Result<Buffer>>;
  deleteFile?(path: string): Promise<Result<void>>;
  moveFile?(data: IMoveFile): Promise<Result<IFile>>;
}
