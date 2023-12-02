import { makeCreateSpinClient, makeGetSpinAllClients } from '@modules/apis';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateSpinClientDTO, ListSpinClientsDTORequest } from './dtos';
import { CustomRequest } from '@shared/types';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/spin/client')
export class SpinClientController {
  @Post()
  @Permissions(Permission.admin, Permission.manager)
  async create(@Body() data: CreateSpinClientDTO, @Res() response: Response) {
    try {
      const result = await makeCreateSpinClient().execute(data);

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }
  @Get()
  @Permissions(Permission.admin, Permission.manager)
  async getAll(
    @Query() query: ListSpinClientsDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeGetSpinAllClients().execute({
        integrationId: request.integrationId,
        filters: {
          name: query.name ?? undefined,
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
}
