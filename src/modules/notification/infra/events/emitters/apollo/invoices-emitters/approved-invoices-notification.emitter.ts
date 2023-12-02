import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEvents } from '@shared/config';

import { Injectable } from '@nestjs/common';
import { IEmitters } from '@shared/types';

export type ApprovedInvoicesApolloNotificationRequest = {
  email_cedente: string;
  valor_aprovado: number;
  nome_cedente: string;
  numero_antecipacao: number;
};

@Injectable()
export class ApprovedInvoicesApolloNotificationEmitter
  implements IEmitters<ApprovedInvoicesApolloNotificationRequest, void>
{
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public async execute(
    data: ApprovedInvoicesApolloNotificationRequest,
  ): Promise<void> {
    this.eventEmitter.emit(NotificationEvents.APPROVED_INVOICES_APOLLO, data);
  }
}
