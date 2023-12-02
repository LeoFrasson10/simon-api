import { Response } from 'express';
import { Controller, Res, Post, HttpStatus, Body } from '@nestjs/common';
import { CreateServiceToIntegrationDTO } from './dtos';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';
import { makeCreateServiceIntegration } from '@modules/service-integration/application';

@Controller('/service-integration')
@Permissions(Permission.admin)
export class ServiceClientController {
  @Post()
  async create(
    @Body() data: CreateServiceToIntegrationDTO,
    @Res() response: Response,
  ) {
    try {
      const result = await makeCreateServiceIntegration().execute(data);

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
