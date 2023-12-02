import { Result } from 'types-ddd';

export interface ICryptoProvider {
  // generateHash(data: string | Buffer): Promise<string>;
  privateEncryptData(data: string): Promise<Result<string>>;
  privateDecryptHash(data: string | Buffer): Promise<Result<string>>;
  publicEncryptData(data: string): Promise<Result<string>>;
  publicDecryptHash(data: string | Buffer): Promise<Result<string>>;
  decryptPublicBaaSHash(data: string | Buffer): Promise<Result<string>>;
  generateHMACKey(length: number): Result<string>;
  calculateHMAC(data: string, key: string): Result<string>;
}
