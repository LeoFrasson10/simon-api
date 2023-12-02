import { Logger } from 'types-ddd';
import { Injectable } from '@nestjs/common';
import { Mailer, NotificationEvents } from '@shared/config';
import {
  EmailTemplate,
  IMailerProvider,
  MakePidgeyProvider,
} from '@shared/providers';
import { ServiceInvoicesNotificationEmitteRequest } from '../../../emitters/apollo/invoices-emitters/service-invoices-notification.emitter';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ServiceInvoicesNotificationListiner {
  private mailerProvider: IMailerProvider;

  constructor() {
    this.mailerProvider = MakePidgeyProvider.getProvider();
  }

  @OnEvent(NotificationEvents.SERVICE_INVOICES_APOLLO, { async: true })
  public execute(data: ServiceInvoicesNotificationEmitteRequest) {
    Logger.info(`[ServiceInvoicesNotificationListiner] Send email`);

    this.mailerProvider
      .sendEmail({
        to: Mailer.defaultEmailsRecipients,
        subject: `NFes de serviço disponibilizadas`,
        template: {
          type: EmailTemplate.TEMPLATE_AP_NOTAS_FISCAIS_DE_SERVICO,
          data: {
            assignorName: data.assignorName,
            assignorDocument: data.assignorDocument,
          },
        },
        attachments: data.Files,
      })
      .then((response) => {
        if (response.isFail()) {
          Logger.error(`Houve um erro ao enviar email: ${response.error()}`);
        }
      })
      .catch((error) =>
        Logger.error(`Houve um erro ao enviar email: ${error.message}`),
      );
  }
}
