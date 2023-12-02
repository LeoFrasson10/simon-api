import { Result } from 'types-ddd';

export type SendLogEmail = {
  title?: string;
  date: string;
  type: string;
  description: string;
};

export interface IDiscordProvider {
  logEmails(data: SendLogEmail): Promise<Result<void>>;
  logRequestFlowInvest(title: string, data: any): Promise<Result<void>>;
}
