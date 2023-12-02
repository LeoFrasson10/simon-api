import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { services } from '@shared/config';
import { Modules, makeHttpClient } from '@shared/providers';
import { Response } from 'express';
import {
  SputnikCreateClientDTORequest,
  SputnikListClientsRequest,
} from './dtos';
import { makeGetIntegrationById } from '@modules/integrations';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/sputnik/client')
export class SputnikClientController {
  private baseUrl = services.baseUrlSputnik;
  private module: Modules = 'sputnik';
  private prefix = 'client';

  @Post()
  @Permissions(Permission.admin)
  async create(
    @Body() data: SputnikCreateClientDTORequest,
    @Res() response: Response,
  ) {
    try {
      const integration = await makeGetIntegrationById().execute({
        integrationId: data.integrationId,
      });

      if (integration.isFail())
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: integration.error() });

      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}`,
        method: 'post',
        module: this.module,
        body: data,
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
    @Query() params: SputnikListClientsRequest,
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

  @Get('/integration/:id')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getClientByIntegration(
    @Param('id') integrationId: string,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/integration/${integrationId}`,
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

  @Get('/:id')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getClient(@Param('id') assignorId: string, @Res() response: Response) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/${assignorId}`,
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
}
