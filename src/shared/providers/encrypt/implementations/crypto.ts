import {
  privateEncrypt,
  publicDecrypt,
  randomBytes,
  createHmac,
  publicEncrypt,
  privateDecrypt,
} from 'crypto';
import { ICryptoProvider } from '../model';
import { cryptoEnv } from '@shared/config';
import { Result } from 'types-ddd';

export class CryptProvider implements ICryptoProvider {
  private readonly privateKey = Buffer.from(
    cryptoEnv.privateKey,
    'base64',
  ).toString('utf-8');
  private readonly publicKey = Buffer.from(
    cryptoEnv.publicKey,
    'base64',
  ).toString('utf-8');

  private readonly publicKeyBaaS = Buffer.from(
    cryptoEnv.baasPublicKey,
    'base64',
  ).toString('utf-8');

  public async privateEncryptData(data: string): Promise<Result<string>> {
    try {
      const hash = privateEncrypt(this.privateKey, Buffer.from(data)).toString(
        'base64',
      );

      return Result.Ok(hash);
    } catch (error) {
      return error;
    }
  }

  public async publicDecryptHash(data: string): Promise<Result<string>> {
    try {
      const decryptedData = publicDecrypt(
        this.publicKey,
        Buffer.from(data, 'base64'),
      ).toString('utf-8');

      return Result.Ok(decryptedData);
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async publicEncryptData(data: string): Promise<Result<string>> {
    try {
      const hash = publicEncrypt(this.publicKey, Buffer.from(data)).toString(
        'base64',
      );

      return Result.Ok(hash);
    } catch (error) {
      return error;
    }
  }

  public async privateDecryptHash(data: string): Promise<Result<string>> {
    try {
      const decryptedData = privateDecrypt(
        this.privateKey,
        Buffer.from(data, 'base64'),
      ).toString('utf-8');

      return Result.Ok(decryptedData);
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async decryptPublicBaaSHash(data: string): Promise<Result<string>> {
    try {
      const decryptedData = publicDecrypt(
        this.publicKeyBaaS,
        Buffer.from(data, 'base64'),
      ).toString('utf-8');

      return Result.Ok(decryptedData);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  public generateHMACKey(length: number): Result<string> {
    return Result.Ok(randomBytes(length).toString('hex'));
  }

  public calculateHMAC(data: string, key: string): Result<string> {
    const hmac = createHmac('sha256', key);
    hmac.update(data);
    return Result.Ok(hmac.digest('hex'));
  }
}
