import {
  makeCreateUser,
  makeFirstAccess,
  makeGetAllUsers,
  makeGetUserById,
  makeGetUserMenuFactory,
} from '@modules/user/application';
import { Response, Request } from 'express';
import {
  Controller,
  Res,
  Query,
  Get,
  Post,
  HttpStatus,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import {
  CreateUserDTO,
  FindAllUsersParams,
  FirstAccessUserDTORequest,
} from './dtos';

import { verifyJWT } from '@shared/helpers';
import { CreatedUserNotificationEmitter } from '@modules/notification';
import { CustomRequest } from '@shared/types';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';
@Controller('/user')
export class UserController {
  constructor(
    private readonly createdUserNotification: CreatedUserNotificationEmitter,
  ) {}
  @Get()
  @Permissions(Permission.admin)
  async getAll(@Query() query: FindAllUsersParams, @Res() response: Response) {
    try {
      const result = await makeGetAllUsers().execute({
        page: Number(query.page ?? 1),
        pageSize: Number(query.pageSize ?? 10),
        filters: {
          active: query.active,
          document: query.document,
          name: query.name,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });
      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Post()
  @Permissions(Permission.admin)
  async create(@Body() data: CreateUserDTO, @Res() response: Response) {
    try {
      const result = await makeCreateUser().execute(data);

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      this.createdUserNotification.execute(result.value());

      return response.json(result.value().user);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get('/menu')
  async getUserMenu(@Res() response: Response, @Req() request: CustomRequest) {
    const userId = request.userId;

    const result = await makeGetUserMenuFactory().execute({
      id: userId,
    });

    if (result.isFail())
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: result.error(),
      });

    return response.json(result.value());
  }

  @Get('/:id')
  @Permissions(Permission.admin)
  async getUserById(@Param('id') id: string, @Res() response: Response) {
    const result = await makeGetUserById().execute({ userId: id });

    if (result.isFail())
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: result.error(),
      });

    return response.json(result.value());
  }

  @Post('/first-access')
  async firstAccessUser(
    @Body() data: FirstAccessUserDTORequest,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const token = request.headers.token as string;

    if (!token) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json('Token de validação não encontrado');
    }

    const { userId } = verifyJWT(token) || {};

    if (!userId) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Token de validação inválido',
      });
    }

    const user = await makeFirstAccess().execute({
      userId,
      ...data,
    });

    if (user.isFail())
      return response.status(HttpStatus.BAD_REQUEST).json(user.error());

    return response.status(HttpStatus.OK).json('Senha criada com sucesso!');
  }
}
