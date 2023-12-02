import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { MongooseService, PrismaService } from '../db';
import { Logger } from 'types-ddd';
import { mongo } from '@shared/config';

type Output = {
  name: string;
  status: number;
  message?: string;
};

@Controller('status')
export class StatusController {
  @Get()
  async checkStatus(@Res() res: Response) {
    const services: Array<Output> = [
      { name: 'Application', status: HttpStatus.OK },
      { name: 'Database', ...(await this.statusOfDatabase()) },
      { name: 'MongoDB', ...(await this.statusOfMongoDB()) },
    ];
    const version = process.env.npm_package_version;
    const statusCode = services.every(
      (service) => service.status === HttpStatus.OK,
    )
      ? HttpStatus.OK
      : HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({ statusCode, version, services });
  }

  private async statusOfMongoDB(): Promise<Pick<Output, 'status' | 'message'>> {
    try {
      const mongoInstance = MongooseService.getInstance();

      return mongoInstance.getDefaultConnection()
        ? { status: HttpStatus.OK }
        : { status: HttpStatus.INTERNAL_SERVER_ERROR };
    } catch (error) {
      Logger.warn(`MONGO_URL: ${mongo.url}`);
      Logger.error(JSON.stringify(error, null, 2));
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  private async statusOfDatabase(): Promise<
    Pick<Output, 'status' | 'message'>
  > {
    try {
      (
        await PrismaService.getInstance()
          .$queryRaw<boolean>`select true as executing`
      )[0].executing;
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
    return { status: HttpStatus.OK };
  }
}
