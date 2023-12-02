import { CryptProvider } from '../implementations';
import { ICryptoProvider } from '../model';

export class MakeEncryptationDocumentProvider {
  private static provider: ICryptoProvider;

  public static getProvider(): ICryptoProvider {
    if (!this.provider) {
      this.provider = new CryptProvider();
    }

    return this.provider;
  }
}
