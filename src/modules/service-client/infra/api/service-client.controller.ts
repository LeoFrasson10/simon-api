import { Response } from 'express';
import {
  Controller,
  Res,
  Get,
  Post,
  HttpStatus,
  Body,
  Param,
} from '@nestjs/common';
import { CreateServiceToClientDTO } from './dtos';
import {
  makeCreateServiceClient,
  makeGetServiceClientById,
} from '@modules/service-client/application';

@Controller('/service-client')
export class ServiceClientController {
  @Post()
  async create(
    @Body() data: CreateServiceToClientDTO,
    @Res() response: Response,
  ) {
    try {
      const result = await makeCreateServiceClient().execute(data);

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
  async getById(@Param('id') id: string, @Res() response: Response) {
    try {
      const result = await makeGetServiceClientById().execute({ id });

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
