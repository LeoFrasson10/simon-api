import { makeHttpClient } from '@shared/providers/http';
import { PidgeyProvider } from '../implementations';
import { IMailerProvider } from '../models';

export class MakePidgeyProvider {
  private static provider: IMailerProvider;

  public static getProvider(): IMailerProvider {
    if (!this.provider) {
      this.provider = new PidgeyProvider(makeHttpClient());
    }

    return this.provider;
  }
}
