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
import { SputnikCreateRuleDTORequest, SputnikListRulesRequest } from './dtos';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/sputnik/rule')
export class SputnikRuleController {
  private baseUrl = services.baseUrlSputnik;
  private module: Modules = 'sputnik';
  private prefix = 'rule';

  @Post()
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async create(
    @Body() data: SputnikCreateRuleDTORequest,
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
    @Query() params: SputnikListRulesRequest,
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

  @Get('/:id')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getRule(@Param('id') ruleId: string, @Res() response: Response) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/${ruleId}`,
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
