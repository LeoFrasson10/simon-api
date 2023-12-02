import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomRequest } from '@shared/types';
import { makeListApolloOperationToFund } from '@modules/apis/apollo';
import { makeGetAllOperations } from '@modules/apis/spin';
import { makeHttpClient, makeSendToDiscordWebhook } from '@shared/providers';
import { services } from '@shared/config';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';
import { verifyFilePDFType } from '@shared/helpers';
import { Logger } from 'types-ddd';

@Controller()
export class SharedController {
  @Get('/service-operations')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getServiceOperations(
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const [result, resultApollo] = await Promise.all([
        makeGetAllOperations().execute(),
        makeListApolloOperationToFund().execute({
          userId: request.userId,
        }),
      ]);

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      if (resultApollo.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      const resp = {
        antecipacoes: resultApollo.value().data,
        capitalDeGiro: result.value(),
      };

      return response.json(resp);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/invoice-settled')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async invoiceSettled(
    @Body() data: any,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const body = {
        ...data,
      };

      const result = await makeHttpClient().requestExternalModule({
        url: `${services.baseUrlApollo}/operation/fund/invoice-settled`,
        method: 'post',
        module: 'apollo',
        body,
        headers: {
          'user-adm-id': request.userId,
        },
      });

      await makeSendToDiscordWebhook().logRequestFlowInvest(
        '/invoice-settled',
        JSON.stringify({
          body,
          result: result.isFail() ? result.error() : result.value(),
        }),
      );

      if (result.isFail()) {
        Logger.error(
          `ERRO[invoice-settled]: ${JSON.stringify(result.error())}`,
        );
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      return response.status(HttpStatus.OK).json(result.value().response);
    } catch (error) {
      Logger.error(`CATCH-ERRO[invoice-settled]: ${error.message}`);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/upload-operations-documents')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'assignmentCommunication', maxCount: 1 },
        { name: 'assignmentTerm', maxCount: 1 },
      ],
      {
        fileFilter: verifyFilePDFType,
      },
    ),
  )
  async uploadDocuments(
    @UploadedFiles()
    files: {
      assignmentCommunication?: Express.Multer.File[];
      assignmentTerm?: Express.Multer.File[];
    },
    @Body() body: { additiveNumber: string; operationSequentialId: string },
    @Res() response: Response,
    @Req() req: CustomRequest,
  ) {
    try {
      if (!files || !files.assignmentTerm)
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Informe assignmentTerm (termo de cessão)!' });
      const formData = new FormData();

      if (files.assignmentCommunication && files.assignmentCommunication[0]) {
        const assignmentCommunication = new Blob(
          [files.assignmentCommunication[0].buffer],
          { type: files.assignmentCommunication[0].mimetype },
        );

        formData.append(
          'assignmentCommunication',
          assignmentCommunication,
          files.assignmentCommunication[0].originalname,
        );
      }

      if (files.assignmentTerm && files.assignmentTerm[0]) {
        const assignmentTerm = new Blob([files.assignmentTerm[0].buffer], {
          type: files.assignmentTerm[0].mimetype,
        });
        formData.append(
          'assignmentTerm',
          assignmentTerm,
          files.assignmentTerm[0].originalname,
        );
      }

      formData.append('operationSequentialId', body.operationSequentialId);
      formData.append('additiveNumber', body.additiveNumber);

      const discordWebhookPayload = {
        ...body,
        assignmentCommunication: files.assignmentCommunication
          ? files.assignmentCommunication.map((file) => ({
              fieldname: file.fieldname,
              originalname: file.originalname,
              mimetype: file.mimetype,
              buffer: Buffer.from(file.buffer).toString(),
            }))
          : [],
        assignmentTerm: files.assignmentTerm
          ? files.assignmentTerm.map((file) => ({
              fieldname: file.fieldname,
              originalname: file.originalname,
              mimetype: file.mimetype,
              buffer: Buffer.from(file.buffer).toString(),
            }))
          : null,
      };

      const result = await makeHttpClient().requestExternalModule({
        url: `${services.baseUrlApollo}/operation/fund/upload-documents`,
        method: 'post',
        module: 'apollo',
        body: formData,
        headers: {
          'user-adm-id': req.userId
        },
      });

      if (result.isFail()) {
        Logger.error(
          `ERRO[upload-operations-documents]: ${JSON.stringify(
            result.error(),
          )}`,
        );
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      await makeSendToDiscordWebhook().logRequestFlowInvest(
        '/upload-operations-documents',
        JSON.stringify({
          ...body,
          assignmentCommunication:
            discordWebhookPayload.assignmentCommunication[0]?.originalname ??
            'Não informado',
          assignmentTerm: discordWebhookPayload.assignmentTerm
            ? discordWebhookPayload.assignmentTerm[0]?.originalname
            : 'Não informado',
        }),
      );

      return response.json(result.value().response);
    } catch (error) {
      Logger.error(`CATCH-ERRO[upload-operations-documents]: ${error.message}`);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Get('/portal/operation/documents/:operationId')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getOperationDocuments(
    @Param('operationId') operationId: string,
    @Res() response: Response,
    @Req() req: CustomRequest,
  ) {

    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${services.baseUrlApollo}/operation/portal/documents/${operationId}`,
        method: 'get',
        module: 'apollo',
        headers: {
          'user-adm-id': req.userId
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
