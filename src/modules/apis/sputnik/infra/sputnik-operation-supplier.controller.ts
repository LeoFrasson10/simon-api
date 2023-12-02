import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { services } from '@shared/config';
import { Modules, makeHttpClient } from '@shared/providers';

import { Response } from 'express';

import { CustomRequest } from '@shared/types';
import { makeGetClientById } from '@modules/client';
import {
  SputnikListInvoicesSupplierDTORequest,
  SputnikListOperationsDTORequest,
  SputnikCreateOperationDTORequest,
} from './dtos';

@Controller('/sputnik/operation/supplier')
export class SputnikOperationController {
  private baseUrl = services.baseUrlSputnik;
  private module: Modules = 'sputnik';
  private prefix = 'operation/supplier';

  @Get('/list-invoices')
  async listInvoices(
    @Query() params: SputnikListInvoicesSupplierDTORequest,
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
          'supplier-id': request.sputnikSupplierId,
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
  async listOperations(
    @Query() params: SputnikListOperationsDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/list`,
        method: 'get',
        module: this.module,
        params,
        headers: {
          'supplier-id': request.sputnikSupplierId,
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

  @Get('/detail/:id')
  async getOperation(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/detail/${id}`,
        method: 'get',
        module: this.module,
        headers: {
          'supplier-id': request.sputnikSupplierId,
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

  @Post('/new')
  async create(
    @Body() data: SputnikCreateOperationDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    if (!request.clientId)
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'ClientId não encontrado',
      });

    const client = await makeGetClientById().execute({
      clientId: request.clientId,
    });

    if (client.isFail())
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: client.error(),
      });

    const clientAccounts = client.value().accounts;

    try {
      const body: SputnikCreateOperationDTORequest = {
        account: clientAccounts.accountNumber,
        agency: clientAccounts.branchNumber,
        bankCode: clientAccounts.bankNumber,
        invoiceIds: data.invoiceIds,
      };

      const operation = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}`,
        method: 'post',
        module: this.module,
        body,
        headers: {
          'supplier-id': request.sputnikSupplierId,
        },
      });

      if (operation.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(operation.error());

      return response.json(operation.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
