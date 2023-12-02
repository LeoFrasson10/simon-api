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
import { UploadFixInvoiceApolloNotificationAssignorRequest } from '../../../emitters';

@Injectable()
export class UploadFixInvoicesApolloNotificationAssignorListener {
  private mailerProvider: IMailerProvider;
  private discordProvider: IDiscordProvider;
  private dateProvider: IDateProvider;

  constructor() {
    this.mailerProvider = MakePidgeyProvider.getProvider();
    this.discordProvider = makeSendToDiscordWebhook();
    this.dateProvider = MakeDateProvider.getProvider();
  }

  @OnEvent(NotificationEvents.UPLOAD_FIX_INVOICE_ASSIGNOR_APOLLO, {
    async: true,
  })
  public execute({
    emailsToSend,
    nf_chave,
    nf_numero,
    file,
    nome_empresa,
    tranches
  }: UploadFixInvoiceApolloNotificationAssignorRequest) {
    Logger.info(`[UploadFixInvoicesApollo] Send email`);

    this.mailerProvider
      .sendEmail({
        to: emailsToSend,
        subject: `FlowBanco | Envio da carta de correção`,
        template: {
          type: EmailTemplate.TEMPLATE_AP_UPLOAD_CORRECAO_DUPLICATA,
          data: {
            nf_chave,
            nf_numero,
            nome_empresa,
            tranches
          },
        },
        attachments: [
          {
            filename: file.originalname,
            content: Buffer.from(file.buffer),
          },
        ],
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
      description: `Empresa: ${nome_empresa} - NF ${nf_numero}`,
    });
  }
}
