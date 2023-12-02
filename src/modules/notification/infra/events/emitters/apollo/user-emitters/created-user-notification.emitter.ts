import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEvents } from '@shared/config';

import { Injectable } from '@nestjs/common';
import { IEmitters } from '@shared/types';

export type CreateUserApolloNotificationRequest = {
  user: any;
  temporaryPassword: string;
};

@Injectable()
export class CreatedUserApolloNotificationEmitter
  implements IEmitters<CreateUserApolloNotificationRequest, void>
{
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public async execute(
    data: CreateUserApolloNotificationRequest,
  ): Promise<void> {
    this.eventEmitter.emit(NotificationEvents.CREATED_USER_APOLLO, data);
  }
}
