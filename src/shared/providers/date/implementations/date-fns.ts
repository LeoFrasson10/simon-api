import * as dateFns from 'date-fns';
import * as allLocales from 'date-fns/locale';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';

import {
  IAddDaysRequestDTO,
  IDifferenceBetweenDateDTO,
  IIsAfterDTO,
  IIsEqualDTO,
  IMaskDateRequestDTO,
} from '../dtos';

import ms, { StringValue } from '@shared/helpers/ms.helper';

import { IDateProvider } from '../models/date-provider';
export class DateFnsProvider implements IDateProvider {
  constructor(private readonly locale: string) {
    dateFns.setDefaultOptions({ locale: allLocales[this.locale] });
  }

  public startOfDay(date: Date): Date {
    return dateFns.startOfDay(date);
  }

  public endOfDay(date: Date): Date {
    return dateFns.endOfDay(date);
  }

  public addHoursToDate({ amount, date }: IAddDaysRequestDTO): Date {
    return dateFns.addHours(date, amount);
  }

  public addMillisecondsToDate({ amount, date }: IAddDaysRequestDTO): Date {
    return dateFns.addMilliseconds(date, amount);
  }

  public addMinutesToDate({
    amount,
    date,
  }: Omit<IAddDaysRequestDTO, 'startDay'>): Date {
    return dateFns.addMinutes(date, amount);
  }

  public addMonthToDate({ amount, date, startDay }: IAddDaysRequestDTO): Date {
    const dateAdded = dateFns.addMonths(date, amount);

    return startDay ? this.startOfDay(dateAdded) : this.endOfDay(dateAdded);
  }

  public removeMonthToDate({
    amount,
    date,
    startDay,
  }: IAddDaysRequestDTO): Date {
    const dateAdded = dateFns.subMonths(date, amount);

    return startDay ? this.startOfDay(dateAdded) : this.endOfDay(dateAdded);
  }

  public addDaysToDate({
    amount,
    date,
    startDay = false,
    endDay = false,
  }: IAddDaysRequestDTO): Date {
    const dateAdded = dateFns.addDays(date, amount);

    if (startDay) {
      return this.startOfDay(dateAdded);
    }
    if (endDay) {
      return this.endOfDay(dateAdded);
    }
    return dateAdded;
  }

  public removeDaysFromDate({
    amount,
    date,
    startDay = false,
    endDay = false,
  }: IAddDaysRequestDTO): Date {
    const dateRemoved = dateFns.subDays(date, amount);

    if (startDay) {
      return this.startOfDay(dateRemoved);
    }
    if (endDay) {
      return this.endOfDay(dateRemoved);
    }
    return dateRemoved;
  }

  public maskDate({ date, mask, timezone }: IMaskDateRequestDTO): string {
    const dateTeste = new Date(date);
    // const clientTimezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const clientDate = utcToZonedTime(
      new Date(dateTeste),
      timezone,
    );
    const formattedDate = dateFns.format(clientDate, mask);

    return formattedDate;
  }

  public getTimeZone(): string {
    const clientTimezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return clientTimezoneName;
  }

  public difference({
    leftDate,
    rightDate,
    differenceIn = 'hours',
  }: IDifferenceBetweenDateDTO): number {
    const getDifference: Record<typeof differenceIn, number> = {
      seconds: dateFns.differenceInSeconds(leftDate, rightDate),
      minutes: dateFns.differenceInMinutes(leftDate, rightDate),
      hours: dateFns.differenceInHours(leftDate, rightDate),
      days: dateFns.differenceInDays(leftDate, rightDate),
      months: dateFns.differenceInMonths(leftDate, rightDate),
      years: dateFns.differenceInYears(leftDate, rightDate),
    };

    return getDifference[differenceIn];
  }

  public isAfter({ leftDate, rightDate }: IIsAfterDTO): boolean {
    return dateFns.isAfter(leftDate, rightDate);
  }

  public isBefore({ leftDate, rightDate }: IIsAfterDTO): boolean {
    return dateFns.isBefore(leftDate, rightDate);
  }

  public isEqual({ leftDate, rightDate }: IIsEqualDTO): boolean {
    return dateFns.isEqual(leftDate, rightDate);
  }

  public isWeekend(data: Date): boolean {
    return dateFns.isWeekend(data);
  }

  public convertToMilliseconds(data: string): number {
    return ms(data as StringValue);
  }
}
export { formatInTimeZone };
