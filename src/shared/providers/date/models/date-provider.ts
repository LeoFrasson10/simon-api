import {
  IAddDaysRequestDTO,
  IDifferenceBetweenDateDTO,
  IIsAfterDTO,
  IIsEqualDTO,
  IMaskDateRequestDTO,
} from '../dtos';

export interface IDateProvider {
  startOfDay(date: Date): Date;
  endOfDay(date: Date): Date;
  addHoursToDate(data: IAddDaysRequestDTO): Date;
  addMonthToDate(data: IAddDaysRequestDTO): Date;
  addMillisecondsToDate(data: IAddDaysRequestDTO): Date;
  addMinutesToDate(data: Omit<IAddDaysRequestDTO, 'startDay'>): Date;
  removeMonthToDate(data: IAddDaysRequestDTO): Date;
  addDaysToDate(data: IAddDaysRequestDTO): Date;
  removeDaysFromDate(data: IAddDaysRequestDTO): Date;
  maskDate(data: IMaskDateRequestDTO): string;
  difference(data: IDifferenceBetweenDateDTO): number;
  isAfter(data: IIsAfterDTO): boolean;
  isBefore(data: IIsAfterDTO): boolean;
  isEqual(data: IIsEqualDTO): boolean;
  isWeekend(data: Date): boolean;
  convertToMilliseconds(data: string): number;
  getTimeZone(): string;
}
