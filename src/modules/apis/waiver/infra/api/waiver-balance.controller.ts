import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  makeCreateWaiverBalance,
  makeGetWaiverBalancesByEconomicGroup,
} from '../../application';
import { CustomRequest } from '@shared/types';
import { makeGetEconomicGroupById } from '@modules/economic-group';
import { CreateWaiverBalanceToClientDTO } from './dtos/balance';

@Controller('/waiver/balance')
export class WaiverBalanceController {
  @Get('/economic-group/:group_id')
  async getByEconomicGroupId(
    @Res() response: Response,
    @Param('group_id') groupId: string,
    @Query('current-date') currentDate: string,
  ) {
    try {
      const economicGroup = await makeGetEconomicGroupById().execute({
        economicGroupId: groupId,
      });

      if (economicGroup.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: economicGroup.error(),
        });

      const result = await makeGetWaiverBalancesByEconomicGroup().execute({
        economicGroupId: economicGroup.value().id,
        currentDate,
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

  @Post('/:client_id')
  async create(
    @Res() response: Response,
    @Param('client_id') clientId: string,
    @Body() data: CreateWaiverBalanceToClientDTO,
    @Req() request: CustomRequest,
  ) {
    try {
      if (!request.userId) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Usuário inválido',
        });
      }
      if (!clientId) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Cliente inválido',
        });
      }
      const result = await makeCreateWaiverBalance().execute({
        ...data,
        clientId: clientId,
        userId: request.userId,
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
