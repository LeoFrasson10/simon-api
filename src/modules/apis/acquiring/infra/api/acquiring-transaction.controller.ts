import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  makeGetAcquiringAllTransaction,
  makeGetAcquiringAllTransactionByEconomicGRoup,
  makeGetAcquiringReceivables,
  makeGetAcquiringReceivablesEconomicGroup,
  makeGetAcquiringTransactionsReport,
  makeGetTransactionsReportByPaymentMethod,
  makeInsertTransactionsByMonth,
} from '../../application';
import { CustomRequest } from '@shared/types';
import {
  FindTransactionsByEconomicGroupRequest,
  FindTransactionsByClientRequest,
  GetReceivablesByEstablishmentIdsRequest,
  GetReceivablesRequest,
  GetTransactionsReportByPaymentMethodRequest,
  GetTransactionsReportRequest,
  InsertTransactionsDTORequest,
} from './dtos';
import {
  makeGetAllClients,
  makeGetClientById,
  makeGetClientsByEconomicGroup,
} from '@modules/client';
import { AcquiringPermissaoGuard } from '../guard';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/acquiring')
export class AcquiringTransactionController {
  @Get('/transactions')
  @UseGuards(AcquiringPermissaoGuard)
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getAll(
    @Query() params: FindTransactionsByClientRequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const client = await makeGetClientById().execute({
        clientId: request.clientId,
      });

      if (client.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: client.error(),
        });
      }

      if (!client.value().establishmentId) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Cód. Pag Seguro não cadastrado',
        });
      }

      const result = await makeGetAcquiringAllTransaction().execute({
        endDate: params.endDate,
        startDate: params.startDate,
        limitData: params.limitData || null,
        page: params.page || 1,
        establishment: params.establishment
          ? params.establishment
          : client.value().establishmentId,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/client/establishments')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getEstablishments(
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const client = await makeGetClientById().execute({
        clientId: request.clientId,
      });

      if (client.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: client.error(),
        });
      }

      const clientValue = client.value();
      const result = {
        id: clientValue.id,
        document: clientValue.document,
        establishment: clientValue.establishmentId,
        economicGroup: clientValue.economicGroupId,
      };
      if (clientValue.economicGroupId) {
        const clientByEconomicGroup =
          await makeGetClientsByEconomicGroup().execute({
            economicGroupId: clientValue.economicGroupId,
          });

        if (clientByEconomicGroup.isFail()) {
          return response.status(HttpStatus.BAD_REQUEST).json({
            message: clientByEconomicGroup.error(),
          });
        }

        const branches = clientByEconomicGroup.value();
        // const concatBranche = [...branches, clientValue];

        if (branches.length > 0) {
          Object.assign(result, {
            affiliated: branches.map((af) => ({
              establishment: af.establishmentId,
              document: af.document,
              id: af.id,
              name: af.name,
            })),
          });
        }
      }

      return response.json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/portal/establishments')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getPortalEstablishments(@Res() response: Response) {
    try {
      const result = await makeGetAllClients().execute({
        page: 1,
        pageSize: 10000,
        filters: {
          onlyAcquiring: true,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Get('/transactions/receivables')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  @UseGuards(AcquiringPermissaoGuard)
  async getReceivables(
    @Query() params: GetReceivablesRequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      if (request.userId && params.establishment) {
        const receivables = await makeGetAcquiringReceivables().execute({
          endDate: params.endDate,
          startDate: params.startDate,
          establishment: params.establishment,
        });

        if (receivables.isFail())
          return response.status(HttpStatus.BAD_REQUEST).json({
            message: receivables.error(),
          });

        return response.json(receivables.value());
      }
      const client = await makeGetClientById().execute({
        clientId: request.clientId,
      });

      if (client.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: client.error(),
        });
      }

      if (!client.value().establishmentId) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Cód. Pag Seguro não cadastrado',
        });
      }

      const result = await makeGetAcquiringReceivables().execute({
        endDate: params.endDate,
        startDate: params.startDate,
        establishment: params.establishment
          ? params.establishment
          : client.value().establishmentId,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/transactions/receivables/economic-group')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  @UseGuards(AcquiringPermissaoGuard)
  async getReceivablesByEconomicGroup(
    @Query() params: GetReceivablesByEstablishmentIdsRequest,
    @Res() response: Response,
  ) {
    try {
      const receivables =
        await makeGetAcquiringReceivablesEconomicGroup().execute({
          endDate: params.endDate,
          startDate: params.startDate,
          establishmentIds: params.establishmentIds,
        });

      if (receivables.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: receivables.error(),
        });

      return response.json(receivables.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/transactions/client')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getEstablishmentClient(
    @Query()
    {
      endDate,
      startDate,
      establishment,
      page,
      limitData,
    }: FindTransactionsByClientRequest,
    @Res() response: Response,
  ) {
    try {
      if (establishment && startDate && endDate) {
        const transactions = await makeGetAcquiringAllTransaction().execute({
          endDate: endDate,
          startDate: startDate,
          limitData: limitData,
          page: page || 1,
          establishment: establishment,
        });

        if (transactions.isFail())
          return response.status(HttpStatus.BAD_REQUEST).json({
            message: transactions.error(),
          });

        return response.json(transactions.value());
      }
      const result = await makeGetAllClients().execute({
        page: 1,
        pageSize: 10000,
        filters: {
          onlyAcquiring: true,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/transactions/economic-group')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getEstablishmentByEconomicGroup(
    @Query()
    params: FindTransactionsByEconomicGroupRequest,
    @Res() response: Response,
  ) {
    try {
      const transactions =
        await makeGetAcquiringAllTransactionByEconomicGRoup().execute({
          endDate: params.endDate,
          startDate: params.startDate,
          establishmentId: params.establishmentId,
          economicGroupId: params.economicGroupId,
        });

      if (transactions.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: transactions.error(),
        });

      return response.json(transactions.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post('/transactions')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async insert(
    @Body() body: InsertTransactionsDTORequest,
    @Res() response: Response,
    // @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeInsertTransactionsByMonth().execute({
        month: body.month,
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });
      }

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('/transactions/report')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async report(
    @Query() params: GetTransactionsReportRequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeGetAcquiringTransactionsReport().execute({
        endDate: params.endDate,
        startDate: params.startDate,
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });
      }

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
  @Get('/transactions/report-by-payment-method')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async reportByPaymentMethod(
    @Query() params: GetTransactionsReportByPaymentMethodRequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeGetTransactionsReportByPaymentMethod().execute(
        params,
      );

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });
      }

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
