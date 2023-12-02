import { services } from '@shared/config';
import { Modules, makeHttpClient } from '@shared/providers';
import {
  ApolloChangeSupplierAssignorDTORequest,
  ApolloChangeSupplierDTORequest,
  ApolloCreateSupplierBranchesAssignorDTORequest,
  CreateApolloSupplierDTORequest,
  ListApolloSuppliersDTORequest,
} from './dtos';
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
import { Response } from 'express';
import { Permissions } from '@shared/decorator';
import { Permission } from '@shared/utils';

@Controller('/apollo/supplier')
export class ApolloSupplierController {
  private baseUrl = services.baseUrlApollo;
  private module: Modules = 'apollo';
  private prefix = 'supplier';

  @Post()
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async create(
    @Body() data: CreateApolloSupplierDTORequest,
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
        message: error.message,
      });
    }
  }

  @Get()
  @Permissions(
    Permission.admin,
    Permission.manager,
    Permission.backoffice,
    Permission.read,
  )
  async listSuppliers(
    @Query() params: ListApolloSuppliersDTORequest,
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
        message: error.message,
      });
    }
  }

  @Get('/:supplierId')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getSupplier(
    @Param('supplierId') supplierId: string,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/${supplierId}`,
        method: 'get',
        module: this.module,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Put('/:supplierId')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async updateSupplier(
    @Param('supplierId') supplierId: string,
    @Body() data: ApolloChangeSupplierDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/${supplierId}`,
        method: 'put',
        module: this.module,
        body: data,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Put('/change-supplier-assignor/:supplierId')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async changeSupplierAssignor(
    @Param('supplierId') supplierId: string,
    @Body() data: ApolloChangeSupplierAssignorDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/change-supplier-assignor/${supplierId}`,
        method: 'put',
        module: this.module,
        body: data,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/add-branches/:supplierId')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async addSupplierBranches(
    @Param('supplierId') supplierId: string,
    @Body() data: ApolloCreateSupplierBranchesAssignorDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/add-branches/${supplierId}`,
        method: 'post',
        module: this.module,
        body: data,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
