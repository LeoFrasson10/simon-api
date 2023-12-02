import { makeHttpClient } from '@shared/providers/http';
import { Lois } from '../implementations';
import { ILois } from '../model';

export const makeLois = (): ILois => {
  return new Lois(makeHttpClient());
};
