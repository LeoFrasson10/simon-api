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
  CreateApolloRatingRuleDTORequest,
  ParamListRulesRequest,
} from './dtos';

@Controller('/apollo/rating-rule')
export class ApolloRatingRuleController {
  private baseUrl = services.baseUrlApollo;
  private module: Modules = 'apollo';
  private prefix = 'rating-rule';

  @Post()
  async create(
    @Body() data: CreateApolloRatingRuleDTORequest,
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
        message: error,
      });
    }
  }

  @Get()
  async listRules(
    @Query() params: ParamListRulesRequest,
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
