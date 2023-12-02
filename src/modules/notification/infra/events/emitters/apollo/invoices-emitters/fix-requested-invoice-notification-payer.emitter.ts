import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEvents } from '@shared/config';

import { Injectable } from '@nestjs/common';
import { IEmitters } from '@shared/types';

enum TrancheStatus {
  pending = 'pending',
  liquidated = 'liquidated',
  overdue = 'overdue',
  canceled = 'canceled',
}

export type FixRequestedInvoicesApolloNotificationPayerRequest = {
  emailsToSend: string[];
  nf_numero: string;
  nf_chave: string;
  tranches?: {
    amount: number;
    status: TrancheStatus;
    dueDate: Date;
    trancheNumber: number;
  }[]
  nome_empresa: string;
};

@Injectable()
export class FixRequestedInvoicesApolloNotificationEmitter
  implements
  IEmitters<FixRequestedInvoicesApolloNotificationPayerRequest, void>
{
  constructor(private readonly eventEmitter: EventEmitter2) { }

  public async execute(
    data: FixRequestedInvoicesApolloNotificationPayerRequest,
  ): Promise<void> {
    this.eventEmitter.emit(
      NotificationEvents.FIX_REQUESTED_INVOICE_PAYER_APOLLO,
      data,
    );
  }
}
