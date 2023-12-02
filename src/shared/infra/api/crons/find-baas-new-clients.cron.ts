import { makeCreateNewClientsBaaS } from '@modules/client';
import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

import { cronEnvs } from '@shared/config';
import { Logger } from 'types-ddd';

@Injectable()
export class FindNewClientsinBaaSCron {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  @Cron(cronEnvs.searchNewClientsCronTime, {
    name: 'findNewClientsInBaaS',
  })
  async findNewClientsInBaaS() {
    if (!cronEnvs.searchNewClientsJobActive) {
      return;
    }
    Logger.info('FindNewClientsInBaaSCron is running');

    const result = await makeCreateNewClientsBaaS().execute();

    if (result.isFail()) {
      Logger.error(result.error());
    } else {
      console.log(result.value());
    }

    return Logger.info('FindNewClientsInBaaSCron exit');
  }
}
