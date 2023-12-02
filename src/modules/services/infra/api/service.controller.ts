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
import { CreateServiceDTORequest, ListServicesDTORequest } from './dtos';
import {
  makeCreateService,
  makeGetAllServices,
  makeGetServiceById,
} from '@modules/services/application';

@Controller('/service')
export class ServiceController {
  @Get()
  async getAll(
    @Query() query: ListServicesDTORequest,
    @Res() response: Response,
  ) {
    const result = await makeGetAllServices().execute({
      page: Number(query.page ?? 1),
      pageSize: Number(query.pageSize ?? 10),
      filters: {
        name: query.name,
        keys: query.keys,
      },
    });

    if (result.isFail())
      return response.status(HttpStatus.BAD_REQUEST).json(result.error());

    return response.json(result.value());
  }

  @Post()
  async create(
    @Body() data: CreateServiceDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeCreateService().execute(data);

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Res() response: Response) {
    const result = await makeGetServiceById().execute({ serviceId: id });

    if (result.isFail())
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: result.error(),
      });

    return response.json(result.value());
  }
}
