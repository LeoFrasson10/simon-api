import { Global, Module } from '@nestjs/common';

import {
  CreatedUserApolloNotificationEmitter,
  CreatedUserApolloNotificationListener,
  CreatedUserNotificationEmitter,
  CreatedUserNotificationListener,
  FixRequestedInvoicesApolloNotificationEmitter,
  FixRequestedInvoicesApolloNotificationPayerListener,
  UploadFixInvoicesApolloNotificationAssignorEmitter,
  UploadFixInvoicesApolloNotificationAssignorListener,
  ServiceInvoicesNotificationEmitter,
  ServiceInvoicesNotificationListiner,
} from '@modules/notification/infra/events';

@Global()
@Module({
  providers: [
    CreatedUserApolloNotificationEmitter,
    CreatedUserApolloNotificationListener,
    CreatedUserNotificationEmitter,
    CreatedUserNotificationListener,
    FixRequestedInvoicesApolloNotificationPayerListener,
    FixRequestedInvoicesApolloNotificationEmitter,
    UploadFixInvoicesApolloNotificationAssignorListener,
    UploadFixInvoicesApolloNotificationAssignorEmitter,
    ServiceInvoicesNotificationEmitter,
    ServiceInvoicesNotificationListiner,
  ],
  exports: [
    CreatedUserApolloNotificationEmitter,
    CreatedUserNotificationEmitter,
    FixRequestedInvoicesApolloNotificationEmitter,
    UploadFixInvoicesApolloNotificationAssignorEmitter,
    ServiceInvoicesNotificationEmitter,
  ],
})
export class NotificationModule {}
