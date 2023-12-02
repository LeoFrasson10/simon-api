import { BCryptProvider } from '../implementations';
import { IEncryptationProvider } from '../model';

export class MakeEncryptationProvider {
  private static provider: IEncryptationProvider;

  public static getProvider(): IEncryptationProvider {
    if (!this.provider) {
      this.provider = new BCryptProvider();
    }

    return this.provider;
  }
}
