import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { CustomRequest } from '@shared/types';
import {
  makeApproveSolicitation,
  makeCreateWaiveWithdrawalSolicitation,
  makeGetWaiverAllClientWithdrawal,
  makeGetWaiverAllSolicitation,
  makeGetWaiverSolicitationById,
  makeGetWaiverSolicitationByIdAndClient,
  makeRefusedSolicitation,
} from '../../application';
import { CreateWithdrawalSolicitationDTO } from './dtos';
import { makeGetAllUsers } from '@modules/user';

@Controller('/waiver/withdrawal-solicitation')
export class WaiverWithDrawalSolicitationController {
  @Get('/clients-balances')
  async getClientsBalances(
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      if (!request.clientId) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Token inválido' });
      }

      const result = await makeGetWaiverAllClientWithdrawal().execute({
        clientId: request.clientId,
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

  @Get('/admin')
  async getAllByAdmin(
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      if (!request.userId) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Não autorizado' });
      }
      const result = await makeGetWaiverAllSolicitation().execute({});

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      const users = await makeGetAllUsers().execute({
        page: 1,
        pageSize: 10000,
        filters: {},
      });

      if (users.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: users.error(),
        });

      const userValues = users.value();

      const solicitations = result.value().map((solicitation) => {
        const user = solicitation.user_id
          ? userValues.data.find((u) => u.id === solicitation.user_id)
          : null;
        return {
          ...solicitation,
          user_approved: user ? user.name : null,
        };
      });

      return response.json(solicitations);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get()
  async getAll(@Res() response: Response, @Req() request: CustomRequest) {
    try {
      if (!request.clientId) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Token inválido' });
      }

      const result = await makeGetWaiverAllSolicitation().execute({
        clientId: request.clientId,
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

  @Post()
  async create(
    @Body() data: CreateWithdrawalSolicitationDTO,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      if (!request.clientId) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Token inválido' });
      }

      const result = await makeCreateWaiveWithdrawalSolicitation().execute({
        ...data,
        clientId: request.clientId,
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
  async getById(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      if (!request.clientId) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Token inválido' });
      }

      const result = await makeGetWaiverSolicitationByIdAndClient().execute({
        clientId: request.clientId,
        solicitationId: id,
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

  @Get('/admin/:id')
  async adminGetById(@Param('id') id: string, @Res() response: Response) {
    try {
      const result = await makeGetWaiverSolicitationById().execute({
        solicitationId: id,
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

  @Put('/admin/approved/:id')
  async approved(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      if (!request.userId) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Não autorizado' });
      }

      const result = await makeApproveSolicitation().execute({
        id,
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

  @Put('/admin/refused/:id')
  async refused(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      if (!request.userId) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Não autorizado' });
      }

      const result = await makeRefusedSolicitation().execute({
        id,
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
