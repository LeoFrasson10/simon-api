import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import {
  ChangeIntegrationDTO,
  CreateCredentialsDTO,
  CreateIntegrationDTO,
  ListClientsDTORequest,
} from './dtos';
import { Response } from 'express';
import {
  makeChangeIntegration,
  makeCreateCredentials,
  makeCreateIntegration,
  makeGetAllIntegrations,
  makeGetIntegrationById,
  makeRefreshIntegrationTokenById,
} from '@modules/integrations/application';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/integration')
export class IntegrationController {
  @Get()
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getAll(
    @Query() query: ListClientsDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeGetAllIntegrations().execute({
        page: Number(query.page ?? 1),
        pageSize: Number(query.pageSize ?? 10),
        filters: {
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
  @Permissions(Permission.admin)
  async create(@Body() data: CreateIntegrationDTO, @Res() response: Response) {
    try {
      const result = await makeCreateIntegration().execute(data);

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
  @Permissions(Permission.admin)
  async getClientById(@Param('id') id: string, @Res() response: Response) {
    try {
      const result = await makeGetIntegrationById().execute({
        integrationId: id,
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

  @Put('/:integrationId')
  @Permissions(Permission.admin)
  async update(
    @Param('integrationId') integrationId: string,
    @Body() data: ChangeIntegrationDTO,
    @Res() response: Response,
  ) {
    try {
      const result = await makeChangeIntegration().execute({
        id: integrationId,
        ...data,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Put('/refresh-token/:id')
  @Permissions(Permission.admin)
  async refreshToken(@Param('id') id: string, @Res() response: Response) {
    try {
      const result = await makeRefreshIntegrationTokenById().execute({
        integrationId: id,
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

  @Post('/credentials/:integrationId')
  @Permissions(Permission.admin)
  async createCredentials(
    @Param('integrationId') integrationId: string,
    @Body() data: CreateCredentialsDTO,
    @Res() response: Response,
  ) {
    try {
      const result = await makeCreateCredentials().execute({
        integrationId,
        baas: data.baas,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
