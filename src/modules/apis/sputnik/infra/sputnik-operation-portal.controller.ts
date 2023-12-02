import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { services } from '@shared/config';
import { Modules, makeHttpClient } from '@shared/providers';

import { Response } from 'express';

import { CustomRequest } from '@shared/types';
import {
  SputnikListOperationsPortalDTORequest,
  SputnikListInvoicesPortalDTORequest,
  SputnikChangeInvoicePortalDtoRequest,
} from './dtos';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/sputnik/operation/portal')
export class SputnikOperationPortalController {
  private baseUrl = services.baseUrlSputnik;
  private module: Modules = 'sputnik';
  private prefix = 'operation/portal';

  @Get('/list-invoices')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async listInvoices(
    @Query() params: SputnikListInvoicesPortalDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/list-invoices`,
        method: 'get',
        module: this.module,
        params,
        headers: {
          'user-adm-id': request.userId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('/list-operations')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async listOperations(
    @Query() params: SputnikListOperationsPortalDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/list-operations`,
        method: 'get',
        module: this.module,
        params,
        headers: {
          'user-adm-id': request.userId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('/invoice/:id')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getOperation(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/invoice/${id}`,
        method: 'get',
        module: this.module,
        headers: {
          'user-adm-id': request.userId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Put('/invoice/:id/update')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async updateInvoice(
    @Param('id') id: string,
    @Body() data: SputnikChangeInvoicePortalDtoRequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/invoice/${id}/update`,
        method: 'put',
        module: this.module,
        body: data,
        headers: {
          'user-adm-id': request.userId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
