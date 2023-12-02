import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { services } from '@shared/config';
import { Modules, makeHttpClient } from '@shared/providers';
import { Response } from 'express';
import {
  ChangePartnerUseCaseDTOInput,
  CreateApolloPartnerDTORequest,
  ParamListPartnersRequest,
} from './dtos';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/apollo/partner')
export class ApolloPartnerController {
  private baseUrl = services.baseUrlApollo;
  private module: Modules = 'apollo';
  private prefix = 'partner';

  @Post()
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async create(
    @Body() data: CreateApolloPartnerDTORequest,
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
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async listPartners(
    @Query() params: ParamListPartnersRequest,
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

  @Get('/:id')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getPartner(@Param('id') partnerId: string, @Res() response: Response) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/${partnerId}`,
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

  @Put('/:partnerId')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async update(
    @Param('partnerId') partnerId: string,
    @Res() response: Response,
    @Body() body: ChangePartnerUseCaseDTOInput,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/${partnerId}`,
        method: 'put',
        module: this.module,
        body,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Put('/change-status/:partnerId')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async changeStatus(
    @Param('partnerId') partnerId: string,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/change-status/${partnerId}`,
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

  @Put('/change-branch-status/:partnerId/:branchId')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async changeBranchStatus(
    @Param('partnerId') partnerId: string,
    @Param('branchId') branchId: string,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/change-branch-status/${partnerId}/${branchId}`,
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
}
