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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { server, services } from '@shared/config';
import { verifyFileType } from '@shared/helpers';
import { makeHttpClient } from '@shared/providers';
import { CustomRequest } from '@shared/types';
import axios from 'axios';
import { Response } from 'express';
import {
  CreateOperationClientDTO,
  CreateOperationModalDTO,
  ListOperationsDTOResquest,
  ProposalFormEntries,
  SimulateParams,
  UpdateOperationsStatusEntry,
} from './dtos';
import {
  makeGetClientByDocumentAndIntegration,
  makeGetClientById,
} from '@modules/client';
import {
  makeCreateClientOperation,
  makeCreateExternalOperation,
  makeCreateInternalOperation,
  makeGetAllOperations,
  makeGetClientOperationById,
  makeGetClientOperations,
  makeGetInternalOperationById,
  makeListOperations,
  makeSimulateOperation,
  makeSimulateOperationApp,
  makeSimulateOperationClient,
  makeUpdateStatusOperations,
} from '../../application';
import { makeGetIntegrationById } from '@modules/integrations';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/spin/operation')
export class OperationController {
  @Get('/list')
  @Permissions(
    Permission.admin,
    Permission.manager,
    Permission.backoffice,
    Permission.read,
  )
  async listSpinOperations(
    @Query() query: ListOperationsDTOResquest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeListOperations().execute({
        page: Number(query.page ?? 1),
        pageSize: Number(query.pageSize ?? 10),
        userId: request.userId,
        document: query.document ?? undefined,
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }
      return response.json(result.value());
    } catch (error) {
      console.log(error);
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/all-proposals')
  @Permissions(
    Permission.admin,
    Permission.manager,
    Permission.backoffice,
    Permission.read,
  )
  async getAllProposals(@Res() response: Response) {
    try {
      const result = await makeGetAllOperations().execute();

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Put('/update-proposals')
  async updateProposals(
    @Res() response: Response,
    @Body() data: UpdateOperationsStatusEntry,
  ) {
    try {
      const result = await makeUpdateStatusOperations().execute(data);

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }
      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post('/new-proposal')
  @UseInterceptors(
    FilesInterceptor('files', 100, { fileFilter: verifyFileType }),
  )
  async createNewProposal(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: CreateOperationModalDTO,
    @Res() response: Response,
    @Req() req: CustomRequest,
  ) {
    try {
      const result = await makeCreateExternalOperation().execute({
        ...data,
        integrationId: req.integrationId,
        files,
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post('/proposal')
  @UseInterceptors(
    FilesInterceptor('files', 10, { fileFilter: verifyFileType }),
  )
  async uploadInternalProposal(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: ProposalFormEntries,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    const ip = request.headers['x-forwarded-for'] as string;
    try {
      const result = await makeCreateInternalOperation().execute({
        ...data,
        files,
        cliendId: request.clientId,
        ip,
      });
      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      return response.json(result.value());
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Post('/client')
  async createNewProposalClient(
    @Body() data: CreateOperationClientDTO,
    @Res() response: Response,
    @Req() req: CustomRequest,
  ) {
    try {
      const integration = await makeGetIntegrationById().execute({
        integrationId: req.integrationId,
      });

      if (integration.isFail())
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(integration.error());

      if (!integration.value().autoApproved)
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Operação não permitida',
        });

      const client = await makeGetClientByDocumentAndIntegration().execute({
        document: data.document,
        integrationId: req.integrationId,
      });

      if (client.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: client.error(),
        });

      const clientValue = client.value();

      const result = await makeCreateClientOperation().execute({
        integrationId: req.integrationId,
        address: `${clientValue.street}, ${clientValue.number}`,
        neighborhood: clientValue.neighborhood,
        city: clientValue.city,
        email: clientValue.email,
        state: clientValue.state,
        zip: clientValue.zip,
        phone: clientValue.phone,
        account: data.account,
        agency: data.agency,
        amount: data.amount,
        bankCode: data.bankCode,
        document: data.document,
        ipAddress: data.ipAddress,
        ownerAccount: data.ownerAccount,
        timezone: data.timezone,
        tranches: data.tranches,
        complement: clientValue.complement,
        totalAmount: data.totalAmount,
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/ccb/:id')
  async getCCB(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const client = await makeGetClientById().execute({
        clientId: request.clientId,
      });

      if (client.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(client.error());
      }

      const ccbResponse = await makeHttpClient().request({
        url: `${services.baseUrlSpin}/operation/ccb/${client.value().id}/${id}`,
        method: 'get',
        headers: {
          'Subscription-Key': services.spinAppKey,
          Origin: server.origin,
        },
      });

      if (ccbResponse.isFail())
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(ccbResponse.error());

      const operationValue = ccbResponse.value().response;

      const pdfResponse = await axios.get(operationValue.ccbUrl, {
        responseType: 'arraybuffer',
      });
      const pdfBuffer = Buffer.from(pdfResponse.data, 'binary');

      const filename = `op-${operationValue.id}-ccb-${operationValue.ccb}.pdf`;

      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader('Content-Disposition', `inline; filename=${filename}`);
      return response.send(pdfBuffer);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/ccb/client/:id')
  async getCCBClient(
    @Param('id') operationId: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const operation = await makeGetClientOperationById().execute({
        integrationId: request.integrationId,
        operationId,
      });

      if (operation.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(operation.error());
      }

      if (!operation.value().ccbUrl) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'CCB não gerada',
        });
      }

      const pdfResponse = await axios.get(operation.value().ccbUrl, {
        responseType: 'arraybuffer',
      });
      const pdfBuffer = Buffer.from(pdfResponse.data, 'binary');

      const filename = `op-${operation.value().id}-ccb-${
        operation.value().ccb
      }.pdf`;

      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader('Content-Disposition', `inline; filename=${filename}`);
      return response.send(pdfBuffer);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post('/simulate/app')
  async simulateApp(@Body() data: SimulateParams, @Res() response: Response) {
    try {
      const result = await makeSimulateOperationApp().execute({
        amount: data.amount,
        interestRate: data.interestRate,
      });
      console.log(result);
      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      return response.json(result.value());
    } catch (error) {
      console.log(error);
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post('/simulate')
  async simulate(
    @Body() data: SimulateParams,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeSimulateOperation().execute({
        ...data,
        integrationId: request.integrationId,
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post('/client/simulate')
  async simulateClient(
    @Body() data: SimulateParams,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeSimulateOperationClient().execute({
        ...data,
        integrationId: request.integrationId,
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/internal/:id')
  async getInternalProposal(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const client = await makeGetClientById().execute({
        clientId: request.clientId,
      });

      if (client.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(client.error());
      }

      const result = await makeGetInternalOperationById().execute({
        operationId: id,
        clientId: client.value().id,
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/client')
  async getAllExternalProposal(
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const integration = await makeGetIntegrationById().execute({
        integrationId: request.integrationId,
      });

      if (integration.isFail())
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: integration.error() });

      const operations = await makeGetClientOperations().execute({
        integrationId: request.integrationId,
      });

      if (operations.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(operations.error());
      }

      if (integration.value().autoApproved) {
        const operationsResult = [];
        for (const operation of operations.value()) {
          const { totalAmount, ...rest } = operation;
          operationsResult.push({
            ...rest,
            liquidValue: totalAmount,
          });
        }

        return response.json(operationsResult);
      }

      return response.json(operations.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/client/:id')
  async getExternalProposalById(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const integration = await makeGetIntegrationById().execute({
        integrationId: request.integrationId,
      });

      if (integration.isFail())
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: integration.error() });

      const operation = await makeGetClientOperationById().execute({
        integrationId: request.integrationId,
        operationId: id,
      });

      if (operation.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(operation.error());
      }

      if (integration.value().autoApproved) {
        const { partners, totalAmount, ...rest } = operation.value();
        return response.json({
          ...rest,
          ownerAccount: partners[0],
          liquidValue: totalAmount,
        });
      }

      return response.json(operation.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }
}
