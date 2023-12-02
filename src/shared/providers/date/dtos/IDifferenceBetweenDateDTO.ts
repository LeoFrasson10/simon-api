import { ITwoDatesDTO } from './ITwoDatesDTO';

export type IDifferenceBetweenDateDTO = ITwoDatesDTO & {
  differenceIn?: 'months' | 'days' | 'hours' | 'years' | 'minutes' | 'seconds';
};
