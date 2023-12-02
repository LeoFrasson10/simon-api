import { Response } from 'express';
import {
  Controller,
  Res,
  Get,
  Post,
  HttpStatus,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  CreateEconomicGroupDTORequest,
  ListEconomicGroupsDTORequest,
} from './dtos';
import {
  makeCreatEconomicGroup,
  makeGetAllEconomicGroups,
  makeGetEconomicGroupById,
} from '@modules/economic-group/application';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/economic-group')
export class EconomicGroupController {
  @Get()
  @Permissions(Permission.admin, Permission.backoffice, Permission.manager)
  async getAll(
    @Query() query: ListEconomicGroupsDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeGetAllEconomicGroups().execute({
        page: Number(query.page ?? 1),
        pageSize: Number(query.pageSize ?? 10),
        filters: {
          active: query.active,
          name: query.name,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Post()
  @Permissions(Permission.admin, Permission.backoffice, Permission.manager)
  async create(
    @Body() data: CreateEconomicGroupDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeCreatEconomicGroup().execute(data);

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get(':id')
  @Permissions(Permission.admin, Permission.backoffice, Permission.manager)
  async getUserById(@Param('id') id: string, @Res() response: Response) {
    try {
      const result = await makeGetEconomicGroupById().execute({
        economicGroupId: id,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
