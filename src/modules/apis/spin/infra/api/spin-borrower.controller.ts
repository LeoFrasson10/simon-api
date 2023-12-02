import {
  makeCreateBorrower,
  makeGetAllBorrowers,
  makeGetAllOperationsByBorrower,
  makeGetLimitBorrower,
  makeGetNewsBorrowers,
  makeProcessBorrowers,
  makeUpdateAnalysingBorrowers,
  makeUpdateBorrower,
  makeUpdateRulesBorrower,
} from '@modules/apis';
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CustomRequest } from '@shared/types';
import { Response } from 'express';
import {
  CreateBorrowerDTO,
  ListSpinBorrowersDTORequest,
  ProcessBorrowerDTO,
  UpdateBorrowerDTO,
} from './dtos';

import { FromCSVString } from '@shared/helpers';
import { makeHttpClient } from '@shared/providers';
import { discordWebhook } from '@shared/config';
import { makeGetIntegrationById } from '@modules/integrations';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';
@Controller('/spin/borrower')
export class BorrowerController {
  @Get()
  async getAll(
    @Query() query: ListSpinBorrowersDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeGetAllBorrowers().execute({
        integrationId: request.integrationId,
        filters: {
          name: query.name ?? undefined,
          page: query.page ?? undefined,
          pageSize: query.pageSize ?? undefined,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }
  @Post()
  async create(@Body() data: CreateBorrowerDTO, @Res() response: Response) {
    try {
      const result = await makeCreateBorrower().execute({
        ...data,
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }
      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }
  @Post('/accept-documents')
  async acceptDocuments(
    @Body() data: ProcessBorrowerDTO,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const integration = await makeGetIntegrationById().execute({
        integrationId: request.integrationId,
      });

      if (integration.isFail()) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(integration.error());
      }

      const result = await makeProcessBorrowers().execute({
        documents: data.documents,
        integrationId: integration.value().id,
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      makeHttpClient().request({
        url: discordWebhook.webhookCnpj,
        method: 'post',
        body: {
          embeds: [
            {
              title: 'Novos CNPJ para análise',
              description: `
                **Integração:** ${integration.value().name}
                **Integração Id:** ${integration.value().id}
                **Documentos:** ${data.documents.map((e) => `${e.cnpj}`)}
              `,
              color: 3034748,
            },
          ],
        },
      });
      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/new-documents/:integration_id')
  async newDocuments(
    @Param('integration_id') integrationId: string,
    @Res() response: Response,
  ) {
    const result = await makeGetNewsBorrowers().execute({
      integrationId,
    });
    if (result.isFail()) {
      const metaData: {
        statusCode?: HttpStatus;
      } = result.metaData();
      return response
        .status(metaData.statusCode || HttpStatus.BAD_REQUEST)
        .json(result.error());
    }

    const borrowers = result.value();

    return response.json(borrowers);
  }

  @Put('/analysing-documents/:integration_id')
  @Permissions(Permission.admin)
  async updateDocuments(
    @Param('integration_id') integrationId: string,
    @Res() response: Response,
    @Body() documents: string[],
  ) {
    const result = await makeUpdateAnalysingBorrowers().execute({
      docs: documents,
      integrationId,
    });

    if (result.isFail()) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: result.error(),
      });
    }

    return response.json(result.value());
  }

  @Put('/rules/csv/:integration_id')
  @UseInterceptors(FileInterceptor('file'))
  async processCSV(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'csv' })],
      }),
    )
    file: Express.Multer.File,
    @Body() { creditAnalyseId }: { creditAnalyseId: string },
    @Res() response: Response,
    @Param('integration_id') integrationId: string,
  ) {
    const bufferToString = file.buffer.toString();
    const unstringifiedCSV = FromCSVString(bufferToString);

    const result = await makeUpdateRulesBorrower().execute({
      creditAnalyseId,
      unstringifiedCSV,
      integrationId: integrationId,
    });

    if (result.isFail()) {
      return response.status(HttpStatus.BAD_REQUEST).json(result.error());
    }

    return response.json(result.value());
  }

  @Get('/operations')
  async operations(@Req() request: CustomRequest, @Res() response: Response) {
    try {
      if (!request.clientId) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Token inválido' });
      }

      const result = await makeGetAllOperationsByBorrower().execute({
        clientId: request.clientId,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.status(HttpStatus.OK).json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/limit')
  async getLimit(@Req() request: CustomRequest, @Res() response: Response) {
    try {
      if (!request.clientId) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Token inválido' });
      }
      const result = await makeGetLimitBorrower().execute({
        clientId: request.clientId,
      });

      console.log(result);

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.status(HttpStatus.OK).json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Put('/:id')
  async update(
    @Body() data: UpdateBorrowerDTO,
    @Req() request: CustomRequest,
    @Param('id') borrowerId: string,
    @Res() response: Response,
  ) {
    try {
      const integration = await makeGetIntegrationById().execute({
        integrationId: request.integrationId,
      });

      if (integration.isFail()) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(integration.error());
      }

      const result = await makeUpdateBorrower().execute({
        integrationId: integration.value().id,
        id: borrowerId,
        ...data,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.status(HttpStatus.OK).json(result.value());
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }
}
