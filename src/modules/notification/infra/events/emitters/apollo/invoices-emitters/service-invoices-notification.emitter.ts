import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEvents } from '@shared/config';

import { Injectable } from '@nestjs/common';
import { IEmitters } from '@shared/types';

export type Files = {
  filename: string;
  content: Buffer;
};
export type ServiceInvoicesNotificationEmitteRequest = {
  assignorName: string;
  assignorDocument: string;
  Files: Files[];
};
@Injectable()
export class ServiceInvoicesNotificationEmitter
  implements IEmitters<ServiceInvoicesNotificationEmitteRequest, void>
{
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public async execute(
    data: ServiceInvoicesNotificationEmitteRequest,
  ): Promise<void> {
    this.eventEmitter.emit(NotificationEvents.SERVICE_INVOICES_APOLLO, data);
  }
}
