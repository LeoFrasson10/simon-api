import {
  CreateSpinTermDTO,
  makeCreateSpinTerm,
  makeGetSpinTerm,
} from '@modules/apis';
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
import { CustomRequest } from '@shared/types';

@Controller('/spin/term')
export class SpinTermController {
  @Get()
  async get(
    @Query() { type }: { type: string },
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeGetSpinTerm().execute({
        integrationId: request.integrationId,
        type,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post()
  async create(
    @Body() data: CreateSpinTermDTO,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeCreateSpinTerm().execute({
        ...data,
        integrationId: request.integrationId,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }
}
