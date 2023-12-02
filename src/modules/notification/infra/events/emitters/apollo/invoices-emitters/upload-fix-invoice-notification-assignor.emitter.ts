import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEvents } from '@shared/config';

import { Injectable } from '@nestjs/common';
import { IEmitters } from '@shared/types';

export type UploadFixInvoiceApolloNotificationAssignorRequest = {
  emailsToSend: string[];
  nf_numero: string;
  nf_chave: string;
  nome_empresa: string;
  tranches: string;
  file: Express.Multer.File;
};

@Injectable()
export class UploadFixInvoicesApolloNotificationAssignorEmitter
  implements IEmitters<UploadFixInvoiceApolloNotificationAssignorRequest, void>
{
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public async execute(
    data: UploadFixInvoiceApolloNotificationAssignorRequest,
  ): Promise<void> {
    this.eventEmitter.emit(
      NotificationEvents.UPLOAD_FIX_INVOICE_ASSIGNOR_APOLLO,
      data,
    );
  }
}
