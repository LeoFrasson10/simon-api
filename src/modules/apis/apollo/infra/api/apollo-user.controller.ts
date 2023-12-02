import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { services } from '@shared/config';
import { Modules, makeHttpClient } from '@shared/providers';
import { Response } from 'express';

import {
  CreateApolloUserDTORequest,
  CreateApolloUserDTOResponse,
  FirstAccessUserDTORequest,
  ParamListUsersRequest,
  SessionApolloUserDTORequest,
} from './dtos';
import { generateJWT, verifyJWT } from '@shared/helpers';
import { CustomRequest } from '@shared/types';
import { CreatedUserApolloNotificationEmitter } from '@modules/notification';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/apollo/user')
export class ApolloUserController {
  private baseUrl = services.baseUrlApollo;
  private module: Modules = 'apollo';
  private prefix = 'user';

  constructor(
    private readonly createdUserNotification: CreatedUserApolloNotificationEmitter,
  ) {}

  @Post()
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async create(
    @Body() data: CreateApolloUserDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule<
        CreateApolloUserDTORequest,
        CreateApolloUserDTOResponse
      >({
        url: `${this.baseUrl}/${this.prefix}`,
        method: 'post',
        module: this.module,
        body: data,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      this.createdUserNotification.execute(result.value().response);

      const { user } = result.value().response;

      return response.json({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Post('/partner')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async createByPartner(
    @Body() data: CreateApolloUserDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      if (!request.userPartnerId) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Usuário inválido',
        });
      }

      const result =
        await makeHttpClient().requestExternalModule<CreateApolloUserDTORequest>(
          {
            url: `${this.baseUrl}/${this.prefix}/partner`,
            method: 'post',
            module: this.module,
            body: data,
            headers: {
              'user-id': request.userPartnerId,
            },
          },
        );

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
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async listUsers(
    @Query() params: ParamListUsersRequest,
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

  @Get('/partner')
  async listPartnerUsers(
    @Query() params: ParamListUsersRequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/partner`,
        method: 'get',
        module: this.module,
        params,
        headers: {
          'user-id': request.userPartnerId,
        },
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
        message: error,
      });
    }
  }

  @Post('/session')
  async userPartnerSession(
    @Body() data: SessionApolloUserDTORequest,
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
        message: error,
      });
    }
  }

  @Post('/partner/first-access')
  async firstAccessUser(
    @Body() data: FirstAccessUserDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    const token = request.headers.token as string;

    if (!token) {
      return response.status(HttpStatus.NOT_FOUND).json({
        message: 'Token de validação não encontrado',
      });
    }

    const payload = verifyJWT(token);

    if (!payload || !payload.userPartnerId) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Token inválido ou expirado',
      });
    }

    const result = await makeHttpClient().requestExternalModule({
      url: `${this.baseUrl}/${this.prefix}/first-access`,
      method: 'post',
      module: this.module,
      body: data,
      headers: {
        token,
        'user-id': payload.userPartnerId,
      },
    });

    if (result.isFail())
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: result.error(),
      });

    return response.status(HttpStatus.OK).json({
      message: 'Senha criada com sucesso!',
    });
  }

  @Put('/change-status/:userId')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async changeStatus(
    @Param('userId') userId: string,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/change-status/${userId}`,
        method: 'put',
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
