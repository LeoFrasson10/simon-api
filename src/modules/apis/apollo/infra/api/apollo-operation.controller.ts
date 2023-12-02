import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  // Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { services } from '@shared/config';
import { Modules, makeHttpClient } from '@shared/providers';
// import { CustomRequest } from '@shared/types';
import { Response } from 'express';

import { FilesInterceptor } from '@nestjs/platform-express';
import { CustomRequest } from '@shared/types';
import { makeGetClientById } from '@modules/client';
import {
  ApolloBindPayerInvoicesToOperationDTORequest,
  ApolloChangeInvoiceStatusDTORequest,
  ApolloChangeOperationStatusDTORequest,
  ApolloChangeTrancheStatusDTORequest,
  ApolloCreateOperationDTORequest,
  ApolloListInvoicesPayerDTORequest,
  ApolloListOperationsDTORequest,
  ApolloUploadInvoicesDTORequest,
} from './dtos';

@Controller('/apollo/operation-assignor')
export class ApolloOperationController {
  private baseUrl = services.baseUrlApollo;
  private module: Modules = 'apollo';
  private prefix = 'operation';

  @Post()
  async create(
    @Body() data: ApolloCreateOperationDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    if (!request.clientId)
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'ClientId não encontrado',
      });

    const client = await makeGetClientById().execute({
      clientId: request.clientId,
    });

    if (client.isFail())
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: client.error(),
      });

    const clientAccounts = client.value().accounts;

    try {
      const body: ApolloCreateOperationDTORequest = {
        account: clientAccounts.accountNumber,
        agency: clientAccounts.branchNumber,
        bankCode: clientAccounts.bankNumber,
        operationType: data.operationType || '',
      };

      const operation = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}`,
        method: 'post',
        module: this.module,
        body,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (operation.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(operation.error());

      return response.json(operation.value().response);
    } catch (error) {
      console.log(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Post('/upload-invoices')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadInvoices(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'xml' })],
      }),
    )
    files: Array<Express.Multer.File>,
    @Body() data: ApolloUploadInvoicesDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const body = {
        ...data,
        files: files.map((file) => ({
          fieldname: file.fieldname,
          originalname: file.originalname,
          mimetype: file.mimetype,
          buffer: Buffer.from(file.buffer).toString(),
        })),
      };

      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/upload-invoices`,
        method: 'post',
        module: this.module,
        body,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Get('/detail/:id')
  async getOperation(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/detail/${id}`,
        method: 'get',
        module: this.module,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Delete('/:operationId')
  async deleteOperation(
    @Res() response: Response,
    @Req() request: CustomRequest,
    @Param('operationId') operationId: string,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/${operationId}`,
        method: 'delete',
        module: this.module,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Get('/assignor-limits')
  async getAssignorLimits(
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/assignor-limits`,
        method: 'get',
        module: this.module,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Get('/list')
  async listOperations(
    @Query() params: ApolloListOperationsDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/list`,
        method: 'get',
        module: this.module,
        params,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Post('/send')
  async sendOperation(
    @Body() { operationId }: ApolloChangeOperationStatusDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/change-status`,
        method: 'put',
        module: this.module,
        body: {
          operationId,
          status: 'created',
        },
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Put('/change-status')
  async changeOperationStatus(
    @Body() data: ApolloChangeOperationStatusDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/change-status`,
        method: 'put',
        module: this.module,
        body: data,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Put('/invoice/change-status')
  async changeInvoiceStatus(
    @Body() data: ApolloChangeInvoiceStatusDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/invoice/change-status`,
        method: 'put',
        module: this.module,
        body: data,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Put('/invoice/tranche/change-status')
  async changeTrancheStatus(
    @Body() data: ApolloChangeTrancheStatusDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/invoice/tranche/change-status`,
        method: 'put',
        module: this.module,
        body: data,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Get('/list-payer-invoices')
  async listReceivedInvoices(
    @Query() params: ApolloListInvoicesPayerDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/list-payer-invoices`,
        method: 'get',
        module: this.module,
        params,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Post('/bind-payer-invoices')
  async bindPayerInvoicesToOperation(
    @Body() data: ApolloBindPayerInvoicesToOperationDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/bind-payer-invoices`,
        method: 'post',
        module: this.module,
        body: data,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Delete('/:operationId/delete-invoice/:invoiceId')
  async deleteInvoice(
    @Res() response: Response,
    @Req() request: CustomRequest,
    @Param('operationId') operationId: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/${operationId}/delete-invoice/${invoiceId}`,
        method: 'delete',
        module: this.module,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }
}
