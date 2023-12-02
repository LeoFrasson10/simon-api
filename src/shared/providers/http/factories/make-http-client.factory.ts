import { NestJSAxios } from '../implementations';
import { IHttpClient } from '../model';

export const makeHttpClient = (): IHttpClient => new NestJSAxios();
