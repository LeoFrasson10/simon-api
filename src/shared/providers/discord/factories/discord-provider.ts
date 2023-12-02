import { makeHttpClient } from '@shared/providers/http';
import { DiscordProvider } from '../implementations';
import { IDiscordProvider } from '../models';

export const makeSendToDiscordWebhook = (): IDiscordProvider => {
  return new DiscordProvider(makeHttpClient());
};
