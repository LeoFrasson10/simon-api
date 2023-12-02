import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { MongooseThemeConfig, ThemeConfigDTO } from '../db/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

type CreateThemeConfigDTORequest = ThemeConfigDTO;

@Controller('theme')
export class ThemeController {
  @Get()
  async list(@Res() res: Response) {
    try {
      const mongoThemeInstance = MongooseThemeConfig.getInstance();
      const themeModel = mongoThemeInstance.getModel('themes');
      const themes: ThemeConfigDTO[] = await themeModel.find().select('-__v');

      return res.status(HttpStatus.OK).json({ data: themes });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('/origin')
  async findByOrigin(@Req() request: Request) {
    try {
      const hostname = request.headers?.hostname;

      if (!hostname) {
        return {
          message: 'Origem não encontrada no cabeçalho da solicitação.',
        };
      }

      const mongoThemeInstance = MongooseThemeConfig.getInstance();
      const themeModel = mongoThemeInstance.getModel('themes');

      const themeConfig = await themeModel
        .findOne({ origin: hostname })
        .select('-__v');

      if (!themeConfig) {
        return { message: 'Configuração de tema não encontrada.' };
      }

      return themeConfig;
    } catch (error) {
      return { error: 'Ocorreu um erro ao buscar a configuração do tema.' };
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('favicon'))
  async create(
    @UploadedFile() favicon: Express.Multer.File,
    @Body() body: CreateThemeConfigDTORequest,
    @Res() response: Response,
  ) {
    try {
      const mongoThemeInstance = MongooseThemeConfig.getInstance();
      const themeModel = mongoThemeInstance.getModel('themes');
      if (!body.origin) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Origem é obrigatório',
        });
      }

      const theme: ThemeConfigDTO = await themeModel
        .findOne({
          origin: body.origin,
        })
        .exec();

      const payload: ThemeConfigDTO = {
        colorPrimary: body.colorPrimary,
        colorSecondary: body.colorSecondary,
        imageUrl: body.imageUrl,
        origin: body.origin,
        appTitle: body.appTitle,
        favicon: favicon.buffer.toString('base64'),
      };

      if (theme) {
        payload.updatedAt = new Date();

        await themeModel.findOneAndUpdate(payload).exec();
      } else {
        payload.updatedAt = new Date();
        payload.createdAt = new Date();

        await themeModel.create(payload);
      }
      delete payload.favicon;

      return response.status(HttpStatus.CREATED).json(payload);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
