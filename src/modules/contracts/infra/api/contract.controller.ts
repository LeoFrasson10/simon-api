import { Response } from 'express';
import {
  Controller,
  Res,
  Get,
  Post,
  HttpStatus,
  Body,
  Param,
  Req,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  CreateContractDTO,
  GenerateClientContractDTO,
  ListContractsDTORequest,
  UpdateContractDTO,
} from './dtos';
import { Permission } from '@shared/utils';
import { CustomRequest } from '@shared/types';
import { Permissions } from '@shared/decorator';
import {
  makeCreateContract,
  makeGenerateClientContract,
  makeGetAllContracts,
  makeGetContractById,
  makeUpdateContract,
} from '@modules/contracts/application';
import { FileInterceptor } from '@nestjs/platform-express';

import * as fs from 'fs';

@Controller('/contracts')
export class ContractController {
  @Post()
  @Permissions(Permission.admin)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() data: CreateContractDTO,
    @Res() response: Response,
    @Req() request: CustomRequest,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    try {
      const result = await makeCreateContract().execute({
        ...data,
        userId: request.userId,
        file,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get()
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async list(
    @Query() query: ListContractsDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeGetAllContracts().execute({
        page: Number(query.page ?? 1),
        pageSize: Number(query.pageSize ?? 10),
        filters: {
          search: query.search,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('/:id')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getById(@Param('id') id: string, @Res() response: Response) {
    try {
      const result = await makeGetContractById().execute({ contractId: id });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Put('/:id')
  @Permissions(Permission.admin)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Res() response: Response,
    @Body() data: UpdateContractDTO,
    @Req() request: CustomRequest,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    try {
      const result = await makeUpdateContract().execute({
        contractId: id,
        title: data.title,
        userId: request.userId,
        description: data.description,
        useSpreadsheet: data.useSpreadsheet,
        file,
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });
      }
      return response.send();
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/generate/:contractId')
  @Permissions(Permission.admin, Permission.backoffice, Permission.manager)
  @UseInterceptors(FileInterceptor('file'))
  async generate(
    @Param('contractId') id: string,
    @Res() response: Response,
    @Body() data: GenerateClientContractDTO,
    @Req() request: CustomRequest,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    try {
      const result = await makeGenerateClientContract().execute({
        contractId: id,
        client: data.client ?? null,
        file: file ?? null,
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });
      }
      // console.log(result);
      if (!fs.existsSync(result.value().path)) {
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Arquivo não encontrado',
        });
      }

      response.set('Content-Type', 'application/zip');
      response.set(
        'Content-Disposition',
        `attachment; filename=${result.value().filename}`,
      );

      const fileStream = fs.createReadStream(result.value().path);
      fileStream.pipe(response);
      fileStream.on('close', () => {
        fs.unlinkSync(result.value().path);
      });
    } catch (error) {
      console.log(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
