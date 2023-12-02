import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdir,
  // readdirSync,
  rmdir,
  // rmdirSync,
  unlink,
} from 'fs';
import { join, dirname, resolve } from 'path';
import { randomUUID } from 'crypto';
import { Result } from 'types-ddd';
import { IFileBucketProvider, IOrigin, IFile, IMoveFile } from '../models';
import { Blob } from 'buffer';

export class LocalFileBucketProvider implements IFileBucketProvider {
  private readonly storagePath = resolve(
    dirname(require.main.filename),
    '../../../files',
  ); // Caminho absoluto para a pasta de armazenamento dos arquivos, fora do diretório do projeto
  constructor() {
    const bucketDir = join(this.storagePath);
    if (!existsSync(bucketDir)) {
      mkdirSync(bucketDir);
    }
  }

  public async createFromBlob({
    fileName,
    fileExtension,
    data,
    prefix,
  }: IOrigin<Blob>): Promise<Result<IFile>> {
    try {
      if (!data) {
        return Result.fail('blob needed');
      }
      const newFileName = `${
        fileName ? fileName : randomUUID()
      }.${fileExtension}`;

      let fullPath = join(this.storagePath, newFileName);

      if (prefix) {
        const bucketDir = join(this.storagePath, prefix);
        if (!existsSync(bucketDir)) {
          mkdirSync(bucketDir);
        }
        fullPath = join(this.storagePath, prefix, newFileName);
      }

      const fileStream = createWriteStream(fullPath);
      fileStream.write(await data.arrayBuffer().then((ab) => Buffer.from(ab)));
      fileStream.close();

      return Result.Ok({
        URL: fullPath,
        fileName: newFileName,
        type: 'local',
      });
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async getFile(path: string): Promise<Result<Buffer>> {
    try {
      const file = readFileSync(path);

      return Result.Ok(file);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  private async isFolderExists(folderPath: string): Promise<Result<boolean>> {
    return Result.Ok(existsSync(folderPath));
  }

  public async deleteFile(path: string): Promise<Result<void>> {
    try {
      const filePath = path;
      const folderPath = dirname(filePath);

      if (this.isFolderExists(folderPath)) {
        unlink(filePath, (error) => {
          if (error) {
            return Result.fail(error);
          } else {
            readdir(folderPath, (error, folder) => {
              if (error) {
                return Result.fail(error);
              } else if (folder.length === 0) {
                rmdir(folderPath, (error) => {
                  if (error) {
                    return Result.fail(error);
                  }
                });
              }
            });
          }
        });
      }

      return Result.Ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async moveFile({
    fileExtension,
    sourcePath,
    fileName,
    prefix,
  }: IMoveFile): Promise<Result<IFile>> {
    try {
      const file = await this.getFile(sourcePath);

      if (file.isFail()) {
        return Result.fail('Arquivo de origem não encontrado');
      }

      const created = await this.createFromBlob({
        fileExtension,
        data: new Blob([file.value()]),
        fileName: fileName || null,
        prefix: prefix || null,
      });

      if (created.isOk()) {
        await this.deleteFile(sourcePath);
      }

      return Result.Ok(created.value());
    } catch (error) {
      return Result.fail(error);
    }
  }
}
