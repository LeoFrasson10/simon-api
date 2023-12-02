import { Logger } from 'types-ddd';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { NotificationEvents } from '@shared/config';
import {
  IDateProvider,
  IDiscordProvider,
  IMailerProvider,
  MakeDateProvider,
  MakePidgeyProvider,
  makeSendToDiscordWebhook,
} from '@shared/providers';
import { FixRequestedInvoicesApolloNotificationPayerRequest } from '../../../emitters';
import { getInvoiceFixRequestTemplate } from '@shared/helpers';

@Injectable()
export class FixRequestedInvoicesApolloNotificationPayerListener {
  private mailerProvider: IMailerProvider;
  private discordProvider: IDiscordProvider;
  private dateProvider: IDateProvider;

  constructor() {
    this.mailerProvider = MakePidgeyProvider.getProvider();
    this.discordProvider = makeSendToDiscordWebhook();
    this.dateProvider = MakeDateProvider.getProvider();
  }

  @OnEvent(NotificationEvents.FIX_REQUESTED_INVOICE_PAYER_APOLLO, {
    async: true,
  })
  public execute({
    emailsToSend,
    nf_chave,
    nf_numero,
    nome_empresa,
    tranches
  }: FixRequestedInvoicesApolloNotificationPayerRequest) {
    Logger.info(
      `[FixRequestedInvoicesApolloNotificationPayerListener] Send email`,
    );
    const template = getInvoiceFixRequestTemplate(tranches, nome_empresa, nf_numero, nf_chave)
    this.mailerProvider
      .sendEmail({
        to: emailsToSend,
        subject: `FlowBanco | Carta de correção`,
        html: template,
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
      type: 'Fix Requested Invoices Apollo Notification Payer',
      date: this.dateProvider.maskDate({
        date: new Date(),
        mask: 'dd/MM/yyyy HH:mm',
        timezone: 'America/Sao_Paulo',
      }),
      description: `NF ${nf_chave}`,
    });
  }
}
