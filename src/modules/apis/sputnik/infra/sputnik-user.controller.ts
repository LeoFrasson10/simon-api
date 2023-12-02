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
  SputnikCreateUserDTORequest,
  SputnikCreateUserDTOResponse,
  SputnikListUsersRequest,
  SputnikSessionUserDTORequest,
} from './dtos';
import { generateJWT } from '@shared/helpers';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/sputnik/user')
export class SputnikUserController {
  private baseUrl = services.baseUrlSputnik;
  private module: Modules = 'sputnik';
  private prefix = 'user';

  @Post()
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async create(
    @Body() data: SputnikCreateUserDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule<
        SputnikCreateUserDTORequest,
        SputnikCreateUserDTOResponse
      >({
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
    @Query() params: SputnikListUsersRequest,
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
  async getUser(@Param('id') userId: string, @Res() response: Response) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/${userId}`,
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

  @Post('/session')
  async sessionByUserOfPartner(
    @Body() data: SputnikSessionUserDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/verify`,
        method: 'post',
        module: this.module,
        body: data,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      const userPartner = result.value().response;

      const token = generateJWT({
        userPartnerId: userPartner.id,
      });

      return response.status(HttpStatus.OK).json({
        token,
        user: {
          id: userPartner.id,
          email: userPartner.email,
        },
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
