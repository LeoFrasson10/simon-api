import { Logger } from 'types-ddd';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { Mailer, NotificationEvents } from '@shared/config';
import {
  EmailTemplate,
  IMailerProvider,
  MakePidgeyProvider,
  IDateProvider,
  MakeDateProvider,
} from '@shared/providers';
import { generateJWT } from '@shared/helpers';
import { CreateUserApolloNotificationRequest } from '../../../emitters';

@Injectable()
export class CreatedUserApolloNotificationListener {
  private mailerProvider: IMailerProvider;

  private dateProvider: IDateProvider;

  constructor() {
    this.mailerProvider = MakePidgeyProvider.getProvider();
    this.dateProvider = MakeDateProvider.getProvider();
  }

  @OnEvent(NotificationEvents.CREATED_USER_APOLLO, { async: true })
  public execute({
    user,
    temporaryPassword,
  }: CreateUserApolloNotificationRequest) {
    Logger.info(`[CreatedUserApolloNotificationListener] Send email`);

    const { token } = generateJWT(
      { userPartnerId: user.id },
      Mailer.maxLifeTokenInNotification,
    );

    // const subjectFormattedDate = this.dateProvider.maskDate({
    //   date: new Date(),
    //   mask: 'dd/MM/yyyy',
    // });

    this.mailerProvider
      .sendEmail({
        to: [user.email],
        subject: `FlowBanco | Primeiro Acesso`,
        template: {
          type: EmailTemplate.TEMPLATE_AP_NOVO_USUARIO,
          data: {
            // cor_cliente: ArClient.color,
            // url_logo_cliente: ArClient.urlLogo,
            nome_usuario: user.name,
            senha_temporaria: temporaryPassword,
            link: `${Mailer.linkClientCallback}?token=${token}`,
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
  }
}
