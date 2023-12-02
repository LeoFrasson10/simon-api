import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import {
  GetAccountBalancesDTORequest,
  GetCompanyDTORequest,
  ListPaymentBillsDTORequest,
  UpdateAccountBalancesDTORequest,
  UpdatePlanAccountsDTORequest,
} from './dtos';
import {
  makeChangePlanAccounts,
  makeCreateClientByCallback,
  makeCreateLoisClients,
  makeGetAccountBalances,
  makeGetBaaSPlans,
  makeListPaymentBills,
  makeUpdateAccountBalances,
} from '@modules/baas/application';
import { makeGetAllClients } from '@modules/client';
import { Permissions } from '@shared/decorator';
import { BaaSCallbackOriginEnum, Permission } from '@shared/utils';
import { CustomRequest } from '@shared/types';
import { MongooseBaaSCallbacks } from '../db';
import { makeGetIntegrationById } from '@modules/integrations';

import { Logger } from 'types-ddd';

@Controller('/baas')
export class BaaSController {
  @Get('/account-monitoring')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getAccountBalances(
    @Query() query: GetAccountBalancesDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeGetAccountBalances().execute({
        documents: query.documents,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
  @Get('/payments-bills-monitoring')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async listPaymentBills(
    @Query() query: ListPaymentBillsDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeListPaymentBills().execute({
        page: Number(query.page ?? 1),
        pageSize: Number(query.pageSize ?? 10),
        filters: {
          document: query.document,
          economicGroupId: query.economicGroupId,
          status: query.status,
        },
      });

      if (result.isFail())
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: result.error() });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('/company')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getCompany(
    @Query() query: GetCompanyDTORequest,
    @Res() response: Response,
  ) {
    try {
      if (!query.search) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Obrigatório pesquisar por CNPJ ou Nome',
        });
      }

      const result = await makeGetAllClients().execute({
        filters: {
          nameOrDocument: query.search,
        },
        page: 1,
        pageSize: 1000,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('/list-plans')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async listPlans(@Res() response: Response) {
    try {
      const result = await makeGetBaaSPlans().execute();

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/sync-clients')
  @Permissions(Permission.admin, Permission.manager)
  async syncClients(
    @Body() body: any,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeCreateLoisClients().execute({
        integrationId: request.integrationId,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json({
        message: result.value(),
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/account-monitoring/update-balances')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async updateAccountBalances(
    @Body() body: UpdateAccountBalancesDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeUpdateAccountBalances().execute({
        documents: body.documents,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/callback/:integrationId')
  async callback(
    @Body() body: any,
    @Res() response: Response,
    @Param('integrationId') integrationId: string,
  ) {
    try {
      const mongoCallbackInstance = MongooseBaaSCallbacks.getInstance();
      const callbackModel = mongoCallbackInstance.getModel('baas-callbacks');

      const integration = await makeGetIntegrationById().execute({
        integrationId,
      });

      if (integration.isFail())
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(integration.error());

      const integrationInstance = integration.value();

      const callback = await callbackModel.create({
        integrationId,
        integrationName: integrationInstance.name,
        origin: body.origin ?? '',
        data: body.payload,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
      if (
        callback &&
        callback.origin === BaaSCallbackOriginEnum.ACCOUNT_CREATE
      ) {
        makeCreateClientByCallback()
          .execute({
            accountId: callback.data.account_id,
            document: callback.data.document,
            integrationId,
          })
          .then((response) => {
            if (response.isFail()) {
              Logger.error(
                `CREATE CLIENT CALLBACK: ${JSON.stringify(response.error())}`,
              );
            } else {
              Logger.info(
                `[SUCCESS] CREATE CLIENT CALLBACK: ${JSON.stringify(
                  response.value(),
                )}`,
              );
            }
          })
          .catch((error) =>
            Logger.error(`[CATCH] CREATE CLIENT CALLBACK: ${error.message}`),
          );
      }

      return response.sendStatus(HttpStatus.OK);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Put('/plans/apply-accounts')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async applyPlansOfAccount(
    @Body() data: UpdatePlanAccountsDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeChangePlanAccounts().execute({
        ...data,
        userId: request.userId,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
