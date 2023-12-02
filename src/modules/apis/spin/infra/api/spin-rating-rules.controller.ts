import {
  CreateRuleDTO,
  FindAllRulesParams,
  makeCreateSpinRule,
  makeSpinGetAllRules,
  makeGetSpinRuleById,
} from '@modules/apis';
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
import { Response } from 'express';
import { CustomRequest } from '@shared/types';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/spin/rating-rule')
export class SpinRatingRuleController {
  @Get()
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async get(
    @Query() query: FindAllRulesParams,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeSpinGetAllRules().execute({
        integrationId: request.integrationId,
        filters: {
          rating: query.rating ?? undefined,
          page: query.page ?? undefined,
          pageSize: query.pageSize ?? undefined,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post()
  @Permissions(Permission.admin, Permission.manager)
  async create(
    @Body() data: CreateRuleDTO,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeCreateSpinRule().execute({
        ...data,
        integrationId: request.integrationId,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/:id')
  @Permissions(Permission.admin, Permission.manager)
  async getById(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeGetSpinRuleById().execute({
        integrationId: request.integrationId,
        ruleId: id,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }
}
