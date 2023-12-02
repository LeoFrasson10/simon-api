import { Result } from 'types-ddd';

import { discordWebhook } from '@shared/config';
import { IDiscordProvider, SendLogEmail } from '../models';
import { IHttpClient } from '@shared/providers/http';

export class DiscordProvider implements IDiscordProvider {
  constructor(private readonly httpClient: IHttpClient) {}

  public async logEmails(data: SendLogEmail): Promise<Result<void>> {
    try {
      await this.httpClient.request({
        method: 'post',
        url: discordWebhook.webhookEmails,
        body: {
          embeds: [
            {
              title: data.title ?? 'Envio de email',
              description: `
                  **Data e hora:** ${data.date}
                  **Tipo de envio:** ${data.type}
                  **Descrição:** ${data.description}
                `,
              color: 3034748,
            },
          ],
        },
      });

      return Result.Ok();
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  public async logRequestFlowInvest(
    title: string,
    data: any,
  ): Promise<Result<void>> {
    try {
      await this.httpClient.request({
        method: 'post',
        url: discordWebhook.webhookFlowInvest,
        body: {
          embeds: [
            {
              title: title || 'Envio de request',
              description: `
                  ${data}
                `,
              color: 3034748,
            },
          ],
        },
      });

      return Result.Ok();
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}
