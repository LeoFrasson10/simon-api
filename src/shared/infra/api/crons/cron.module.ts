import { Module } from '@nestjs/common';
import { FindNewClientsinBaaSCron } from './find-baas-new-clients.cron';

@Module({
  providers: [FindNewClientsinBaaSCron],
})
export class CronJobsModule {}
