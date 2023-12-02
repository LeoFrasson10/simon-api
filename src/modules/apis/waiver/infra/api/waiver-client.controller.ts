import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateWaiverClientDTO } from './dtos';
import {
  makeCreateWaiverClient,
  makeGetWaiverAllClient,
  makeGetWaiverClientByExtId,
  makeGetWaiverClientById,
} from '../../application';
import { CustomRequest } from '@shared/types';

@Controller('/waiver/client')
export class WaiverClientController {
  @Post()
  async create(
    @Body() data: CreateWaiverClientDTO,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      if (!data.establishmentId) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Id do estabelecimento na Pagseguro é obrigatório',
        });
      }

      const result = await makeCreateWaiverClient().execute({
        ...data,
        integrationId: request.integrationId,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get()
  async getAll(@Res() response: Response) {
    try {
      const result = await makeGetWaiverAllClient().execute();

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/economic-group')
  async getByEconomicGroup(
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      if (!request.clientId) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Token inválido' });
      }

      const result = await makeGetWaiverClientByExtId().execute({
        clientExtId: request.clientId,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/:id')
  async getById(@Res() response: Response, @Param('id') clientId: string) {
    try {
      const result = await makeGetWaiverClientById().execute({
        clientId,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }
}
