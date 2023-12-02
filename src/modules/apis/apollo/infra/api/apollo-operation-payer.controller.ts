import {
  // Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  // Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { services } from '@shared/config';
import { Modules, makeHttpClient } from '@shared/providers';
import { Response } from 'express';
import {
  ApolloListInvoicesPayerDTORequest,
  // ApolloUploadInvoicesPayerDTORequest,
} from './dtos';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CustomRequest } from '@shared/types';

@Controller('/apollo/operation/payer')
export class ApolloOperationPayerController {
  private baseUrl = services.baseUrlApollo;
  private module: Modules = 'apollo';
  private prefix = 'operation';

  @Post('/upload-invoices')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadInvoicesPayer(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'xml' })],
      }),
    )
    files: Array<Express.Multer.File>,
    @Res() response: Response,
    @Req() req: CustomRequest,
  ) {
    try {
      const body = {
        files: files.map((file) => ({
          fieldname: file.fieldname,
          originalname: file.originalname,
          mimetype: file.mimetype,
          buffer: Buffer.from(file.buffer).toString(),
        })),
      };

      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/payer/upload-invoices`,
        method: 'post',
        module: this.module,
        body,
        headers: {
          'user-id': req.userPartnerId,
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

  @Delete('/delete-invoice/:invoiceId')
  async deletePayerInvoice(
    @Param('invoiceId') invoiceId: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/payer/delete-invoice/${invoiceId}`,
        method: 'delete',
        module: this.module,
        headers: {
          'user-id': request.userPartnerId,
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

  @Get('/list-invoices')
  async listReceivedInvoicesPayer(
    @Query() params: ApolloListInvoicesPayerDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/payer/list-invoices`,
        method: 'get',
        module: this.module,
        params,
        headers: {
          'user-id': request.userPartnerId,
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
