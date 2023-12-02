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
import { services } from '@shared/config';
import { FromCSVString } from '@shared/helpers';
import { Modules, makeHttpClient } from '@shared/providers';
import { Response } from 'express';
import {
  CreateApolloAssignorDTORequest,
  ParamListAssignorsRequest,
} from './dtos';
import { CustomRequest } from '@shared/types';
import { makeGetApolloAssignorByExternalId } from '../../application';

@Controller('/apollo/assignor')
export class ApolloAssignorController {
  private baseUrl = services.baseUrlApollo;
  private module: Modules = 'apollo';
  private prefix = 'assignor';

  @Post()
  async create(
    @Body() data: CreateApolloAssignorDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}`,
        method: 'post',
        module: this.module,
        body: data,
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

  @Get()
  async listAssignors(
    @Query() params: ParamListAssignorsRequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}`,
        method: 'get',
        module: this.module,
        params,
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

  @Put('/status-change/:id')
  async changeStatus(
    @Param('id') assignorId: string,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/status-change/${assignorId}`,
        method: 'put',
        module: this.module,
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

  @Get('/new')
  async listNewAssignors(@Res() response: Response) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/new`,
        method: 'get',
        module: this.module,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(Object.values(result.value().response));
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }
  @Get('/me')
  async getMe(@Res() response: Response, @Req() request: CustomRequest) {
    try {
      if (!request.clientId) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Client Id não encontrado',
        });
      }

      const assignor = await makeGetApolloAssignorByExternalId().execute({
        clientId: request.clientId,
        integrationId: request.integrationId,
      });

      if (assignor.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: assignor.error(),
        });

      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/me/${request.clientId}`,
        method: 'get',
        module: this.module,
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

  @Get('/:id')
  async getAssignor(
    @Param('id') assignorId: string,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/${assignorId}`,
        method: 'get',
        module: this.module,
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
    try {
      const bufferToString = file.buffer.toString();
      const unstringifiedCSV = FromCSVString(bufferToString);

      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/rules/csv/${integrationId}`,
        method: 'put',
        module: this.module,
        body: {
          creditAnalyseId,
          unstringifiedCSV,
        },
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());
      }

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }
}
