import { Request } from 'express';
import { ServiceInvoicesNotificationEmitter } from '@modules/notification';
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
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { APIDocumentations, APITags, Mailer, services } from '@shared/config';
import { MakeDateProvider, Modules, makeHttpClient } from '@shared/providers';
import { Response } from 'express';

import { CustomRequest } from '@shared/types';
import {
  ApolloApproveInvoicesPayerDTORequest,
  ApolloChangeInvoiceFixPortalDTORequest,
  ApolloConfirmInvoicesAssignorDTORequest,
  ApolloCreateInvoiceFixAssignorDTORequest,
  ApolloCreateInvoiceFixDraweeDTORequest,
  ApolloCreateInvoiceFixDraweeDTOResponse,
  ApolloCreateInvoiceFixTranche,
  ApolloCreateOperationDraweeDTORequest,
  ApolloExportOperationSupplierInvoicesPayerDTORequest,
  ApolloExportOperationSupplierInvoicesPayerDTOResponse,
  ApolloExportOperationSupplierInvoicesPortalDTOResponse,
  ApolloLUploadInvoicesAssignorDTORequest,
  ApolloListOperationSupplierInvoicesAssignorDTORequest,
  ApolloListOperationSupplierInvoicesAssignorDTOResponse,
  ApolloListOperationSupplierInvoicesPayerDTORequest,
  ApolloListOperationSupplierInvoicesPortalDTORequest,
  ApolloListOperationsPayerDTORequest,
  ApolloListSupplierPayerDTORequest,
  ApolloRefuseInvoicesPayerDTORequest,
  ApolloUploadInvoiceFixSupplierDTORequest,
  ApolloUploadInvoiceFixSupplierDTOResponse,
  ApolloUploadInvoiceFixTrancheSupplierDTORequest,
  ApolloUploadInvoicesUnmappedWithFileDTORequest,
  ChangeInvoiceReceivedDtoRequest,
  GetConsentAgreementDTORequest,
  RefuseInvoiceFixPortalDtoRequest,
  RefuseInvoiceFixPortalDtoResponse,
  TrancheStatus,
} from './dtos';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Permissions, CreateSwaggerMetadata } from '@shared/decorator';
import { Permission } from '@shared/utils';
import { makeGetClientById } from '@modules/client';
import { makeListApolloOperationToFund } from '../../application';
import {
  FixRequestedInvoicesApolloNotificationEmitter,
  UploadFixInvoicesApolloNotificationAssignorEmitter,
} from '@modules/notification';
import { currencyToBRL } from '@shared/helpers';
import { makeApolloInvoicesXLSXProvider } from '@shared/providers/xlsx';
import {
  ApprovedInvoicesDTO,
  ConfirmInvoicesDTO,
  InvoiceActionsResponse,
  CreateInvoiceFixDTORequest,
  CreateInvoiceFixDTO,
  CreateOperationDTO,
  FilesUploadDTO,
  InvoiceAssignorResponse,
  InvoicePayerResponse,
  ListInvoiceAssignorResponse,
  ListInvoicePayerResponse,
  ListOperationResponse,
  ListSuppliersResponse,
  RefusedInvoicesDTO,
  UploadInvoiceCTEorNFSe,
  UploadInvoiceFixResponse,
  UploadInvoicesResponse,
  CreateInvoiceFixResponse,
  UploadFixInvoice,
} from './dtos/api-documents';

@Controller('/apollo/operation-supplier')
export class ApolloOperationSupplierController {
  constructor(
    private readonly fixRequestedNotification: FixRequestedInvoicesApolloNotificationEmitter,
    private readonly uploadFixInvoiceNotification: UploadFixInvoicesApolloNotificationAssignorEmitter,
    private readonly serviceInvoicesNotification: ServiceInvoicesNotificationEmitter,
  ) {}
  private baseUrl = services.baseUrlApollo;
  private module: Modules = 'apollo';
  private prefix = 'operation';
  // private mailerProvider: IMailerProvider;

  @Get('/fund/list-operations')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async listFundOperations(
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeListApolloOperationToFund().execute({
        userId: request.userId,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('/portal/list-invoices')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.Portal,
    tags: [APITags.anticipation],
    operationSummary: 'Listar notas fiscais',
  })
  @Permissions(
    Permission.admin,
    Permission.manager,
    Permission.backoffice,
    Permission.read,
  )
  async listPortalInvoices(
    @Query() params: ApolloListOperationSupplierInvoicesPortalDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/portal/list-invoices`,
        method: 'get',
        module: this.module,
        params: {
          ...params,
          supplierDocument: params.supplierDocument,
          invoiceNumber: params.invoiceNumber,
          confirmationDateStart: params.confirmationDateStart,
          confirmationDateEnd: params.confirmationDateEnd,
          status: params.status,
          userId: request.userId,
        },
        headers: {
          'user-adm-id': request.userId,
        },
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

  @Get('/portal/invoice/:invoiceId')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.Portal,
    tags: [APITags.anticipation],
    operationSummary: 'Buscar NF por ID',
  })
  @Permissions(
    Permission.admin,
    Permission.manager,
    Permission.backoffice,
    Permission.read,
  )
  async getInvoicePortal(
    @Res() response: Response,
    @Req() request: CustomRequest,
    @Param('invoiceId') invoiceId: string,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/portal/invoice/${invoiceId}`,
        method: 'get',
        module: this.module,
        params: {
          userId: request.userId,
        },
        headers: {
          'user-adm-id': request.userId,
        },
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

  @Get('/portal/export-invoices')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.Portal,
    tags: [APITags.anticipation],
    operationSummary: 'Exportar notas fiscais',
  })
  @Permissions(
    Permission.admin,
    Permission.manager,
    Permission.backoffice,
    Permission.read,
  )
  async portalExportInvoicesData(
    @Query() params: ApolloListOperationSupplierInvoicesPortalDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result =
        await makeHttpClient().requestExternalModule<ApolloExportOperationSupplierInvoicesPortalDTOResponse>(
          {
            url: `${this.baseUrl}/${this.prefix}/portal/export-invoices`,
            method: 'get',
            module: this.module,
            params: {
              confirmationDateStart: params.confirmationDateStart,
              confirmationDateEnd: params.confirmationDateEnd,
              userId: request.userId,
              status: params.status,
              supplierDocument: params.supplierDocument,
            },
            headers: {
              'user-adm-id': request.userId,
            },
          },
        );

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      const apolloData = result.value().response
        ? result.value().response.data
        : [];

      const consultationDate = new Date();

      const fieldMapping = {
        payerCorporateName: 'Cedente',
        supplierCorporateName: 'Fornecedor',
        invoiceNumber: 'Número NF',
        invoiceAmount: 'Valor',
        emissionDate: 'Emissão',
        dueDate: 'Vencimento',
        status: 'Status',
        createdAt: 'Data de upload',
      };

      const exportFile =
        await makeApolloInvoicesXLSXProvider().generateToBuffer({
          consultationDate,
          data: apolloData,
          fieldMapping,
        });

      if (exportFile.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Erro ao gerar arquivo',
        });
      }

      response.set(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.set(`Content-Disposition', 'attachment; filename=dados.xlsx`);
      response.send(exportFile.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('/portal/list-operations')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.Portal,
    tags: [APITags.anticipation],
    operationSummary: 'Listar operações',
  })
  @Permissions(
    Permission.admin,
    Permission.manager,
    Permission.backoffice,
    Permission.read,
  )
  async listPortalOperations(
    @Query() params: ApolloListOperationsPayerDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/portal/list-operations`,
        method: 'get',
        module: this.module,
        params: {
          ...params,
        },
        headers: {
          'user-adm-id': request.userId,
        },
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

  @Get('/assignor/list-invoices')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.assignor],
    operationSummary: 'Listar Notas fiscais',
    queryParameters: [
      {
        name: 'page',
        required: false,
      },
      {
        name: 'pageSize',
        required: false,
      },
      {
        name: 'createdAtStart',
        required: false,
      },
      {
        name: 'createdAtEnd',
        required: false,
      },
      {
        name: 'status',
        required: false,
      },
    ],
    response: {
      status: 200,
      type: ListInvoiceAssignorResponse,
    },
  })
  async listAssignorInvoices(
    @Query() query: ApolloListOperationSupplierInvoicesAssignorDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const params: ApolloListOperationSupplierInvoicesAssignorDTORequest = {
        ...query,
        supplierId: request.supplierAssignorId,
      };
      const result = await makeHttpClient().requestExternalModule<
        any,
        ApolloListOperationSupplierInvoicesAssignorDTOResponse
      >({
        url: `${this.baseUrl}/${this.prefix}/supplier/list-invoices`,
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
        message: error.message,
      });
    }
  }

  @Get('/assignor/invoice/:invoiceId')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.assignor],
    operationSummary: 'Buscar nota fiscal por ID',
    response: {
      status: 200,
      type: InvoiceAssignorResponse,
    },
  })
  async getAssignorInvoice(
    @Param('invoiceId') invoiceId: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/supplier/${request.supplierAssignorId}/invoice/${invoiceId}`,
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
        message: error.message,
      });
    }
  }

  @Get('/payer/list-suppliers')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.payer],
    operationSummary: 'Listar Fornecedores do parceiro',
    queryParameters: [
      {
        name: 'page',
        required: false,
      },
      {
        name: 'onlyAwaitingInvoices',
        required: false,
      },
    ],
    response: {
      status: 200,
      type: ListSuppliersResponse,
    },
  })
  async listPayerSuppliers(
    @Query() params: ApolloListSupplierPayerDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/drawee/list-suppliers`,
        method: 'get',
        module: this.module,
        params: {
          ...params,
          userId: request.userPartnerId,
        },
        headers: {
          'user-id': request.userPartnerId,
        },
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

  @Get('/payer/list-invoices')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.payer],
    operationSummary: 'Listar Notas fiscais',
    queryParameters: [
      {
        name: 'page',
        required: false,
      },
      {
        name: 'pageSize',
        required: false,
      },
      {
        name: 'confirmationDateStart',
        required: false,
      },
      {
        name: 'confirmationDateEnd',
        required: false,
      },
      {
        name: 'status',
        required: false,
      },
    ],
    response: {
      status: 200,
      type: [ListInvoicePayerResponse],
    },
  })
  async listPayerInvoices(
    @Query() params: ApolloListOperationSupplierInvoicesPayerDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/drawee/list-invoices`,
        method: 'get',
        module: this.module,
        params: {
          ...params,
          supplierDocument: params.supplierDocument,
          invoiceNumber: params.invoiceNumber,
          confirmationDateStart: params.confirmationDateStart,
          confirmationDateEnd: params.confirmationDateEnd,
          status: params.status,
          userId: request.userPartnerId,
        },
        headers: {
          'user-id': request.userPartnerId,
        },
      });
      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      return response.json(result.value().response);
    } catch (error) {
      console.log(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('/payer/invoice/:invoiceId')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.payer],
    operationSummary: 'Buscar nota fiscal por ID',
    response: {
      status: 200,
      type: [InvoicePayerResponse],
    },
  })
  async getPayerInvoice(
    @Param('invoiceId') invoiceId: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/drawee/${request.userPartnerId}/invoice/${invoiceId}`,
        method: 'get',
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
        message: error.message,
      });
    }
  }

  @Get('/payer/list-operations')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.payer],
    operationSummary: 'Listar Operações',
    response: {
      status: 200,
      type: [ListOperationResponse],
    },
    queryParameters: [
      {
        name: 'page',
        required: false,
      },
      {
        name: 'pageSize',
        required: false,
      },
      {
        name: 'createdAtStart',
        required: false,
      },
      {
        name: 'createdAtEnd',
        required: false,
      },
      {
        name: 'status',
        required: false,
      },
    ],
  })
  async listPayerOperations(
    @Query() params: ApolloListOperationsPayerDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/drawee/list-operations`,
        method: 'get',
        module: this.module,
        params: {
          ...params,
          supplierDocument: params.supplierDocument,
          status: params.status,
          userId: request.userPartnerId,
          createdAtStart: params.createdAtStart,
          createdAtEnd: params.createdAtEnd,
        },
        headers: {
          'user-id': request.userPartnerId,
        },
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

  @Get('/payer/export-invoices')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.payer],
    operationSummary: 'Exportar Notas fiscais',
    queryParameters: [
      {
        name: 'confirmationDateStart',
        required: false,
      },
      {
        name: 'confirmationDateEnd',
        required: false,
      },
      {
        name: 'status',
        required: false,
      },
      {
        name: 'supplierDocument',
        required: false,
      },
    ],
  })
  async payerExportInvoicesData(
    @Query() params: ApolloExportOperationSupplierInvoicesPayerDTORequest,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result =
        await makeHttpClient().requestExternalModule<ApolloExportOperationSupplierInvoicesPayerDTOResponse>(
          {
            url: `${this.baseUrl}/${this.prefix}/drawee/export-invoices`,
            method: 'get',
            module: this.module,
            params: {
              supplierDocument: params.supplierDocument,
              invoiceNumber: params.invoiceNumber,
              confirmationDateStart: params.confirmationDateStart,
              confirmationDateEnd: params.confirmationDateEnd,
              status: params.status,
              userId: request.userPartnerId,
            },
            headers: {
              'user-id': request.userPartnerId,
            },
          },
        );

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      const apolloData = result.value().response
        ? result.value().response.data
        : [];

      const consultationDate = new Date();

      const fieldMapping = {
        invoiceNumber: 'Número NF',
        invoiceKey: 'Chave NF',
        supplierCorporateName: 'Fornecedor',
        supplierDocument: 'CNPJ',
        invoiceAmount: 'Valor',
        emissionDate: 'Emissão',
        dueDate: 'Vencimento',
        confirmationDate: 'Disponibilizada em',
        status: 'Status',
        approvedBy: 'Aprovado por',
        approvedAt: 'Aprovado em',
      };

      const exportFile =
        await makeApolloInvoicesXLSXProvider().generateToBuffer({
          consultationDate,
          data: apolloData,
          fieldMapping,
        });

      if (exportFile.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Erro ao gerar arquivo',
        });
      }

      response.set(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.set(`Content-Disposition', 'attachment; filename=dados.xlsx`);
      response.send(exportFile.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/assignor/upload-invoices')
  @UseInterceptors(FilesInterceptor('files'))
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.assignor],
    operationSummary: 'Upload de NFe',
    isUpload: true,
    body: {
      type: FilesUploadDTO,
    },
    response: {
      status: 200,
      type: UploadInvoicesResponse,
    },
  })
  async uploadInvoicesAssignor(
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
      const body: ApolloLUploadInvoicesAssignorDTORequest = {
        supplierId: req.supplierAssignorId,
        files: files.map((file) => ({
          fieldname: file.fieldname,
          originalname: file.originalname,
          mimetype: file.mimetype,
          buffer: Buffer.from(file.buffer).toString(),
        })),
      };

      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/supplier/upload-invoices`,
        method: 'post',
        module: this.module,
        body,
        headers: {
          'assignor-id': req.assignorId,
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

  @Post('/assignor/upload-invoices-unmapped')
  @UseInterceptors(FilesInterceptor('files'))
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.assignor],
    operationSummary: 'Upload de NFSe e CTe',
    isUpload: true,
    body: {
      type: UploadInvoiceCTEorNFSe,
    },
    response: {
      status: 200,
      type: UploadInvoicesResponse,
    },
  })
  async uploadInvoicesCteAssignor(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'pdf' })],
      }),
    )
    files: Array<Express.Multer.File>,
    @Res() response: Response,
    @Req() request: Request,
    @Req() req: CustomRequest,
  ) {
    const { clientId } = req;

    if (!request.body.invoices) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Informe as notas',
      });
    }
    const invoices = JSON.parse(request.body.invoices);

    try {
      const client = await makeGetClientById().execute({
        clientId: clientId,
      });

      if (client.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(client.error());

      const clientInstance = client.value();

      const body: ApolloUploadInvoicesUnmappedWithFileDTORequest = [];

      for (const invoice of invoices) {
        const file = files.find(
          (file) => file.originalname === `${invoice.filename}`,
        );

        if (file) {
          body.push({
            amount: invoice.amount,
            dueDate: new Date(invoice.dueDate),
            number: invoice.number,
            invoiceType: invoice.invoiceType,
            file: {
              fieldname: file.originalname,
              originalname: file.originalname,
              mimetype: file.mimetype,
              buffer: Buffer.from(file.buffer),
            },
          });
        }
      }

      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/supplier/upload-invoices-unmapped`,
        method: 'post',
        module: this.module,
        body,
        headers: {
          'assignor-id': req.assignorId,
        },
      });

      this.serviceInvoicesNotification.execute({
        assignorName: clientInstance.name,
        assignorDocument: clientInstance.document,
        Files: files.map((file) => {
          return {
            filename: `${file.originalname}.pdf`,
            content: Buffer.from(file.buffer),
          };
        }),
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

  @Post('/assignor/upload-fix-invoice/:invoiceId')
  @UseInterceptors(FileInterceptor('file'))
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.assignor],
    operationSummary:
      'Upload de carta de correção, quando existir solicitação de correção',
    isUpload: true,
    body: {
      type: UploadFixInvoice,
    },
    response: {
      status: 200,
      type: UploadInvoiceFixResponse,
    },
  })
  async uploadInvoiceFixAssignor(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
    @Req() req: CustomRequest,
    @Param('invoiceId') invoiceId: string,
    @Body() body: ApolloUploadInvoiceFixSupplierDTORequest,
  ) {
    try {
      const tranches = JSON.parse(
        body.tranches,
      ) as ApolloUploadInvoiceFixTrancheSupplierDTORequest[];

      const result = await makeHttpClient().requestExternalModule<
        any,
        ApolloUploadInvoiceFixSupplierDTOResponse
      >({
        url: `${this.baseUrl}/${this.prefix}/supplier/upload-fix-invoice`,
        method: 'post',
        module: this.module,
        body: {
          supplierId: req.supplierAssignorId,
          invoiceId,
          file: {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            buffer: Buffer.from(file.buffer).toString(),
          },
          tranches: tranches,
        },
        headers: {
          'assignor-id': req.assignorId,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      const fixResponse = result.value().response;

      const emailsToSend = [];

      let assignorCorporateName = '';

      if (fixResponse.externalClientId) {
        const client = await makeGetClientById().execute({
          clientId: fixResponse.externalClientId,
        });

        if (client.isOk() && client.value().name) {
          assignorCorporateName = client.value().name;
        }
      }

      if (Mailer.defaultEmailsRecipients.length > 0) {
        emailsToSend.push(...Mailer.defaultEmailsRecipients);
      }
      const dateProvide = MakeDateProvider.getProvider();
      let trancheText = '';
      tranches.map((t) => {
        trancheText = `${trancheText}\nParcela: ${
          t.trancheNumber
        }°  Data de vencimento: ${dateProvide.maskDate({
          date: new Date(t.dueDate),
          mask: 'dd/MM/yyyy',
        })} Valor: ${currencyToBRL(t.amount)}`;
      });

      this.uploadFixInvoiceNotification.execute({
        emailsToSend,
        nf_chave: fixResponse.emailData.invoiceKey,
        nf_numero: fixResponse.emailData.invoiceNumber,
        file,
        tranches: trancheText,
        nome_empresa: assignorCorporateName,
      });

      return response.json(result.value().response);
    } catch (error) {
      console.log(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Post('/assignor/confirm-invoices')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.assignor],
    operationSummary: 'Confirmar envio das NFs',
    body: {
      type: ConfirmInvoicesDTO,
    },
    response: {
      status: 200,
      type: InvoiceActionsResponse,
    },
  })
  async confirmInvoicesAssignor(
    @Body() data: ApolloConfirmInvoicesAssignorDTORequest,
    @Req() request: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      const body: ApolloConfirmInvoicesAssignorDTORequest = {
        invoiceIds: data.invoiceIds,
        supplierId: request.supplierAssignorId,
      };

      const response = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/supplier/confirm-invoices`,
        method: 'post',
        module: this.module,
        body,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (response.isFail())
        return res.status(HttpStatus.BAD_REQUEST).json(response.error());

      return res.json(response.value().response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Post('/assignor/create-invoice-fix/:invoiceId')
  @UseInterceptors(FileInterceptor('file'))
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.assignor],
    operationSummary: 'Upload de carta de correção',
    isUpload: true,
    body: {
      type: CreateInvoiceFixDTORequest,
    },
    response: {
      status: 200,
      type: CreateInvoiceFixResponse,
    },
  })
  async createInvoiceFixAssignor(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'xml' })],
      }),
    )
    file: Express.Multer.File,
    @Body() body: ApolloCreateInvoiceFixAssignorDTORequest,
    @Req() request: CustomRequest,
    @Res() res: Response,
    @Param('invoiceId') invoiceId: string,
  ) {
    try {
      const tranches = JSON.parse(
        body.tranches,
      ) as ApolloCreateInvoiceFixTranche[];
      const response = await makeHttpClient().requestExternalModule<
        any,
        ApolloCreateInvoiceFixDraweeDTOResponse
      >({
        url: `${this.baseUrl}/${this.prefix}/supplier/create-invoice-fix`,
        method: 'post',
        module: this.module,
        body: {
          supplierId: request.supplierAssignorId,
          invoiceId,
          fixRequested: body.fixRequested,
          file: {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            buffer: Buffer.from(file.buffer).toString(),
          },
          tranches: tranches,
        },
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (response.isFail())
        return res.status(HttpStatus.BAD_REQUEST).json(response.error());

      const fixResponse = response.value().response;

      const emailsToSend = [];

      let assignorCorporateName = '';

      if (request.clientId) {
        const client = await makeGetClientById().execute({
          clientId: request.clientId,
        });

        if (client.isOk() && client.value().name) {
          assignorCorporateName = client.value().name;
        }
      }

      if (Mailer.defaultEmailsRecipients.length > 0) {
        emailsToSend.push(...Mailer.defaultEmailsRecipients);
      }

      let trancheText = '';
      const dateProvide = MakeDateProvider.getProvider();
      tranches.map((t) => {
        trancheText = `${trancheText}\nParcela: ${
          t.trancheNumber
        }°  Data de vencimento: ${dateProvide.maskDate({
          date: new Date(t.dueDate),
          mask: 'dd/MM/yyyy',
        })} Valor: ${currencyToBRL(t.amount)}`;
      });
      this.uploadFixInvoiceNotification.execute({
        emailsToSend,
        nf_chave: fixResponse.emailData.invoiceKey,
        nf_numero: fixResponse.emailData.invoiceNumber,
        file,
        tranches: trancheText,
        nome_empresa: assignorCorporateName,
      });

      return res.json(response.value().response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Put('/portal/update-invoice-fix/:invoiceId')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.Portal,
    tags: [APITags.anticipation],
    operationSummary: 'Validar carta de correção',
  })
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async updateInvoice(
    @Body() data: ApolloChangeInvoiceFixPortalDTORequest,
    @Req() request: CustomRequest,
    @Res() res: Response,
    @Param('invoiceId') invoiceId: string,
  ) {
    try {
      const response = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/portal/update-invoice-fix/${invoiceId}`,
        method: 'put',
        module: this.module,
        body: data,
        headers: {
          'user-adm-id': request.userId,
        },
      });

      if (response.isFail())
        return res.status(HttpStatus.BAD_REQUEST).json(response.error());

      return res.json(response.value().response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Put('/portal/refuse-invoice-fix')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async refuseInvoiceFix(
    @Body() data: RefuseInvoiceFixPortalDtoRequest,
    @Req() request: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      const response = await makeHttpClient().requestExternalModule<
        any,
        RefuseInvoiceFixPortalDtoResponse
      >({
        url: `${this.baseUrl}/${this.prefix}/portal/refuse-invoice-fix`,
        method: 'post',
        module: this.module,
        body: data,
        headers: {
          'user-adm-id': request.userId,
        },
      });

      if (response.isFail())
        return res.status(HttpStatus.BAD_REQUEST).json(response.error());

      const emailsToSend = [];
      if (Mailer.defaultEmailsRecipients.length > 0) {
        emailsToSend.push(...Mailer.defaultEmailsRecipients);
      }

      const responseInstance = response.value().response;
      let trancheText = '';

      const dateProvide = MakeDateProvider.getProvider();
      responseInstance.tranches.map((t) => {
        trancheText = `${trancheText}\nParcela: ${
          t.trancheNumber
        }°  Data de vencimento: ${dateProvide.maskDate({
          date: new Date(t.dueDate),
          mask: 'dd/MM/yyyy',
        })} Valor: ${currencyToBRL(t.amount)}`;
      });

      this.fixRequestedNotification.execute({
        emailsToSend,
        nf_chave: responseInstance.invoiceKey,
        nf_numero: responseInstance.invoiceNumber,
        nome_empresa: responseInstance.assignorCorporateName,
        tranches: responseInstance.tranches.map((t) => {
          return {
            ...t,
            status: t.status as TrancheStatus,
          };
        }),
      });

      return res.json(response.value().response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Post('/payer/refuse-invoices')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.payer],
    operationSummary: 'Recusar NFs',
    body: {
      type: RefusedInvoicesDTO,
    },
    response: {
      status: 200,
      type: InvoiceActionsResponse,
    },
  })
  async refuseInvoicesPayer(
    @Body() data: ApolloRefuseInvoicesPayerDTORequest,
    @Req() request: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      const body: ApolloRefuseInvoicesPayerDTORequest = {
        userId: request.userPartnerId,
        invoices: data.invoices,
      };

      const response = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/drawee/refuse-invoices`,
        method: 'post',
        module: this.module,
        body,
        headers: {
          'user-id': request.userPartnerId,
        },
      });

      if (response.isFail())
        return res.status(HttpStatus.BAD_REQUEST).json(response.error());

      return res.json(response.value().response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Post('/payer/approve-invoices')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.payer],
    operationSummary: 'Aprovar NFs',
    body: {
      type: ApprovedInvoicesDTO,
    },
    response: {
      status: 200,
      type: InvoiceActionsResponse,
    },
  })
  async approveInvoicesPayer(
    @Body() data: ApolloApproveInvoicesPayerDTORequest,
    @Req() request: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      const body: ApolloApproveInvoicesPayerDTORequest = {
        ipAddress: data.ipAddress,
        geolocation: data.geolocation,
        invoiceIds: data.invoiceIds,
        userId: request.userPartnerId,
      };

      const response = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/drawee/approve-invoices`,
        method: 'post',
        module: this.module,
        body,
        headers: {
          'user-id': request.userPartnerId,
        },
      });

      if (response.isFail())
        return res.status(HttpStatus.BAD_REQUEST).json(response.error());

      return res.json(response.value().response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Post('/payer/create-operation')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.payer],
    operationSummary: 'Criar operação',
    body: {
      type: CreateOperationDTO,
    },
  })
  async createOperationPayer(
    @Body() { data }: ApolloCreateOperationDraweeDTORequest,
    @Req() request: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      if (data.length === 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Obrigatório informar uma nota!',
        });
      }

      const invoices = [];

      for (const invoice of data) {
        const client = await makeGetClientById().execute({
          clientId: invoice.assignorExternalClientId,
        });

        if (client.isFail())
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: client.error(),
          });

        const clientAccounts = client.value().accounts;

        if (!clientAccounts) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Dados bancários não encontrado',
          });
        }

        invoices.push({
          id: invoice.invoiceId,
          account: clientAccounts.accountNumber,
          agency: clientAccounts.branchNumber,
          bankCode: clientAccounts.bankNumber,
        });
      }

      const response = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/drawee/create-operation`,
        method: 'post',
        module: this.module,
        body: {
          userId: request.userPartnerId,
          invoices,
        },
        headers: {
          'user-id': request.userPartnerId,
        },
      });

      if (response.isFail())
        return res.status(HttpStatus.BAD_REQUEST).json(response.error());

      return res.json(response.value().response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Delete('/payer/delete-invoice-fix/:invoiceFixId')
  async deleteInvoiceFix(
    @Param('invoiceFixId') invoiceFixId: string,
    @Req() request: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      if (!invoiceFixId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Obrigatório informar o id da correção!',
        });
      }

      const response = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/drawee/delete-invoice-fix/${invoiceFixId}`,
        method: 'delete',
        module: this.module,
        headers: {
          'user-id': request.userPartnerId,
        },
      });

      if (response.isFail())
        return res.status(HttpStatus.BAD_REQUEST).json(response.error());

      return res.json(response.value().response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Post('/payer/create-invoice-fix/:invoiceId')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.payer],
    operationSummary: 'Solicitar correção de NF',
    body: {
      type: CreateInvoiceFixDTO,
    },
  })
  async createInvoiceFixPayer(
    @Body() body: ApolloCreateInvoiceFixDraweeDTORequest,
    @Req() request: CustomRequest,
    @Res() res: Response,
    @Param('invoiceId') invoiceId: string,
  ) {
    try {
      const response = await makeHttpClient().requestExternalModule<
        ApolloCreateInvoiceFixDraweeDTORequest,
        ApolloCreateInvoiceFixDraweeDTOResponse
      >({
        url: `${this.baseUrl}/${this.prefix}/drawee/create-invoice-fix`,
        method: 'post',
        module: this.module,
        body: {
          userId: request.userPartnerId,
          invoiceId,
          fixRequested: body.fixRequested,
          tranches: body.tranches,
        },
        headers: {
          'user-id': request.userPartnerId,
        },
      });

      if (response.isFail())
        return res.status(HttpStatus.BAD_REQUEST).json(response.error());

      const fixResponse = response.value().response;

      const emailsToSend = [];

      let assignorCorporateName = '';

      if (fixResponse.externalClientId) {
        const client = await makeGetClientById().execute({
          clientId: fixResponse.externalClientId,
        });

        if (client.isOk()) {
          if (client.value().email) {
            emailsToSend.push(client.value().email);
          }
          assignorCorporateName = client.value().name;
        }
      }

      if (Mailer.defaultEmailsRecipients.length > 0) {
        emailsToSend.push(...Mailer.defaultEmailsRecipients);
      }

      if (fixResponse.isSendEmail) {
        this.fixRequestedNotification.execute({
          emailsToSend,
          nf_chave: fixResponse.emailData.invoiceKey,
          nf_numero: fixResponse.emailData.invoiceNumber,
          nome_empresa: assignorCorporateName,
          tranches: body.tranches.map((t) => {
            return {
              ...t,
              dueDate: new Date(t.dueDate),
            };
          }),
        });
      }

      return res.json({ id: fixResponse.id });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Put('/assignor/cancel-invoice/:invoiceId')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.ApolloSupplier,
    tags: [APITags.assignor],
    operationSummary: 'Cancelar envio da NF',
    response: {
      status: 204,
    },
  })
  async cancelInvoiceAssignor(
    @Param('invoiceId') invoiceId: string,
    @Req() request: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      const response = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/supplier/${request.supplierAssignorId}/cancel-invoice/${invoiceId}`,
        method: 'put',
        module: this.module,
        headers: {
          'assignor-id': request.assignorId,
        },
      });

      if (response.isFail())
        return res.status(HttpStatus.BAD_REQUEST).json(response.error());

      return res.json(response.value().response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Put('/portal/change-invoice')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.Portal,
    tags: [APITags.anticipation],
    operationSummary: 'Alterar nota fiscal',
  })
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async changeInvoiceAssignor(
    @Body() data: ChangeInvoiceReceivedDtoRequest,
    @Req() request: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      const response = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/portal/change-invoice`,
        method: 'put',
        module: this.module,
        body: data,
        headers: {
          'user-adm-id': request.userId,
        },
      });

      if (response.isFail())
        return res.status(HttpStatus.BAD_REQUEST).json(response.error());

      return res.json(response.value().response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  @Get('/portal/invoice-file/pdf/:invoiceId')
  @CreateSwaggerMetadata({
    apiDocumentations: APIDocumentations.Portal,
    tags: [APITags.anticipation],
    operationSummary: 'Retornar PDF da NF',
  })
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getFile(
    @Param('invoiceId') id: string,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/portal/invoice-file/pdf/${id}`,
        method: 'get',
        module: this.module,
        headers: {
          'user-adm-id': request.userId,
        },
      });
      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json(result.error());

      const buffered = Buffer.from(result.value().response.buffer);

      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader('Content-Disposition', 'inline; filename=example.pdf');
      response.send(buffered);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/payer/consent-agreement')
  async getConsentAgreement(
    @Body() body: GetConsentAgreementDTORequest[],
    @Res() res: Response,
    @Req() request: CustomRequest,
  ) {
    try {
      const result = await makeHttpClient().requestExternalModule({
        url: `${this.baseUrl}/${this.prefix}/drawee/consent-agreement`,
        method: 'get',
        body: body,
        module: this.module,
        headers: {
          'user-id': request.userPartnerId,
        },
      });

      if (result.isFail())
        return res.status(HttpStatus.BAD_REQUEST).json(result.error());

      return res.json(result.value().response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
