import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEvents } from '@shared/config';

import { Injectable } from '@nestjs/common';
import { IEmitters } from '@shared/types';

export type CreateUserNotificationRequest = {
  user: any;
  temporaryPassword: string;
};

@Injectable()
export class CreatedUserNotificationEmitter
  implements IEmitters<CreateUserNotificationRequest, void>
{
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public async execute(data: CreateUserNotificationRequest): Promise<void> {
    this.eventEmitter.emit(NotificationEvents.CREATED_USER, data);
  }
}
