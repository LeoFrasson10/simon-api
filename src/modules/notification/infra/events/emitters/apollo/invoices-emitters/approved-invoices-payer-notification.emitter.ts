import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEvents } from '@shared/config';

import { Injectable } from '@nestjs/common';
import { IEmitters } from '@shared/types';

export type ApprovedInvoicesPayerApolloNotificationRequest = {
  emailsToSend: string[];
  valor_total: number;
  nome_cedente: string;
  numero_antecipacao: number;
  usuario: string;
};

@Injectable()
export class ApprovedInvoicesPayerApolloNotificationEmitter
  implements IEmitters<ApprovedInvoicesPayerApolloNotificationRequest, void>
{
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public async execute(
    data: ApprovedInvoicesPayerApolloNotificationRequest,
  ): Promise<void> {
    this.eventEmitter.emit(
      NotificationEvents.APPROVED_INVOICES_PAYER_APOLLO,
      data,
    );
  }
}
