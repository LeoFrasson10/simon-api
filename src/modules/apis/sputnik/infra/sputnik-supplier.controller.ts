import { services } from '@shared/config';
import { Modules, makeHttpClient } from '@shared/providers';
import {
  SputnikChangeSupplierDTORequest,
  SputnikCreateSupplierDTORequest,
  SputnikListSuppliersDTORequest,
} from './dtos';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';
import { makeGetClientByDocumentAndIntegration } from '@modules/client';

@Controller('/sputnik/supplier')
export class SputnikSupplierController {
  private baseUrl = services.baseUrlSputnik;
  private module: Modules = 'sputnik';
  private prefix = 'supplier';

  @Post()
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async create(
    @Body() data: SputnikCreateSupplierDTORequest,
    @Res() response: Response,
  ) {
    try {
      if (!data.integrationId) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Integração não informada',
        });
      }

      const client = await makeGetClientByDocumentAndIntegration().execute({
        document: data.document,
        integrationId: data.integrationId,
      });

      let externalClientId = null;
      if (client.value()) {
        externalClientId = client.value().id;
      } else {
        externalClientId = data.externalClientId;
      }

      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}`,
        method: 'post',
        module: this.module,
        body: {
          ...data,
          externalClientId,
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

  @Get()
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async list(
    @Query() params: SputnikListSuppliersDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}`,
        method: 'get',
        module: this.module,
        params,
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

  @Get('/:supplierId')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getSupplier(
    @Param('supplierId') supplierId: string,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/${supplierId}`,
        method: 'get',
        module: this.module,
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

  @Put('/:supplierId')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async updateSupplier(
    @Param('supplierId') supplierId: string,
    @Res() response: Response,
    @Body() data: SputnikChangeSupplierDTORequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/${supplierId}`,
        method: 'put',
        body: data,
        module: this.module,
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
