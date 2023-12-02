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
  CreateApolloFinancialEntityDTORequest,
  ParamListClientsRequest,
} from './dtos';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/apollo/financial-entities')
@Permissions(Permission.admin, Permission.manager, Permission.backoffice)
export class ApolloFinancialEntityController {
  private baseUrl = services.baseUrlApollo;
  private module: Modules = 'apollo';
  private prefix = 'financial-entities';

  @Post()
  async create(
    @Body() data: CreateApolloFinancialEntityDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}`,
        method: 'post',
        module: this.module,
        body: data,
      });

      if (result.isFail())
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            result.error() ? { message: result.error() } : result.metaData(),
          );

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Get()
  async list(
    @Query() params: ParamListClientsRequest,
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
        message: error,
      });
    }
  }

  @Get('/:id')
  async getById(@Param('id') id: string, @Res() response: Response) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/${id}`,
        method: 'get',
        module: this.module,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }
}
