import { Logger } from 'types-ddd';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { NotificationEvents } from '@shared/config';
import {
  EmailTemplate,
  IDateProvider,
  IDiscordProvider,
  IMailerProvider,
  MakeDateProvider,
  MakePidgeyProvider,
  makeSendToDiscordWebhook,
} from '@shared/providers';
import { ApprovedInvoicesApolloNotificationRequest } from '../../../emitters';

@Injectable()
export class ApprovedInvoicesApolloNotificationListener {
  private mailerProvider: IMailerProvider;
  private discordProvider: IDiscordProvider;
  private dateProvider: IDateProvider;

  constructor() {
    this.mailerProvider = MakePidgeyProvider.getProvider();
    this.discordProvider = makeSendToDiscordWebhook();
    this.dateProvider = MakeDateProvider.getProvider();
  }

  @OnEvent(NotificationEvents.APPROVED_INVOICES_APOLLO, { async: true })
  public execute({
    nome_cedente,
    numero_antecipacao,
    valor_aprovado,
    email_cedente,
  }: ApprovedInvoicesApolloNotificationRequest) {
    Logger.info(`[ApprovedInvoicesApolloNotificationListener] Send email`);

    this.mailerProvider
      .sendEmail({
        to: [email_cedente],
        subject: `FlowBanco | Nova antecipação`,
        template: {
          type: EmailTemplate.TEMPLATE_AP_APROVACAO_DUPLICATAS,
          data: {
            nome_cedente,
            numero_antecipacao,
            valor_aprovado,
          },
        },
      })
      .then((response) => {
        if (response.isFail()) {
          Logger.error(`Houve um erro ao enviar email: ${response.error()}`);
        }
      })
      .catch((error) =>
        Logger.error(`Houve um erro ao enviar email: ${error.message}`),
      );

    this.discordProvider.logEmails({
      type: 'Upload Fix Invoices Apollo',
      date: this.dateProvider.maskDate({
        date: new Date(),
        mask: 'dd/MM/yyyy HH:mm',
        timezone: 'America/Sao_Paulo',
      }),
      description: `Cedente: ${nome_cedente}`,
    });
  }
}
