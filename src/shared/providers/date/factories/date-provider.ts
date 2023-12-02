import { DateFnsProvider, formatInTimeZone } from '../implementations/date-fns';
import { IDateProvider } from '../models/date-provider';

export class MakeDateProvider {
  private static provider: IDateProvider;

  public static getProvider(): IDateProvider {
    if (!this.provider) {
      this.provider = new DateFnsProvider('ptBR');
    }

    return this.provider;
  }
}

export { formatInTimeZone };
