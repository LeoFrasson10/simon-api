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
} from '@nestjs/common';
import {
  makeCreateClient,
  makeCreateClientIntegration,
  makeCreateNewClientsBaaS,
  makeGetAllClients,
  makeGetClientById,
  makeGetClientFromBaaS,
  makeGetClientServices,
  makeGetClientsByEconomicGroup,
  makeUpdateClient,
} from '@modules/client';
import {
  CreateClientByIntegrationDTO,
  CreateClientDTO,
  ListClientsDTORequest,
  UpdateClientDTO,
} from './dtos';
import { makeCompany } from '@shared/providers';
import { PartnerTypeEnum, Permission } from '@shared/utils';
import { CustomRequest } from '@shared/types';
import { makeGetIntegrationById } from '@modules/integrations';
import { Permissions } from '@shared/decorator';
import { removeSpecialCharacters } from '@shared/helpers';
import { makeCreateIndividualClient } from '@modules/baas/application';
import { Result } from 'types-ddd';

@Controller('/client')
export class ClientController {
  @Post()
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async create(
    @Body() data: CreateClientDTO,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    try {

      const documentOnlyNumbers = removeSpecialCharacters(data.document);

      if (documentOnlyNumbers.length === 14) {
        const verifyIntegration = await makeGetIntegrationById().execute({
          integrationId: request.integrationId,
        });

        if (verifyIntegration.isFail()) {
          return response.status(HttpStatus.UNAUTHORIZED).json({
            message: 'Token inválido',
          });
        }
        const companyBaaS = await makeCompany().requestCompanyByDocument(
          data.document,
        );

        if (companyBaaS.isFail()) {
          return response.status(HttpStatus.BAD_REQUEST).json({
            message: companyBaaS.error(),
          });
        }

        const company = companyBaaS.value().company;

        const companyAddress = company.address;
        const { countryCode, area, phone } = company.phone;
        const account = company.alias_account;
        const partnersPFBaaS = company.partnersPF;
        const partnersPJBaaS = company.partnersPJ;

        const clientCreated = await makeCreateClient().execute({
          baasId: company._id,
          city: companyAddress.city,
          country: companyAddress.country,
          neighborhood: companyAddress.neighborhood,
          number: companyAddress.number,
          state: companyAddress.state,
          street: companyAddress.street,
          zip: companyAddress.zip,
          complement: companyAddress.complement,
          document: company.documentNumber,
          email: company.companyEmail,
          integrationId: verifyIntegration.value().id,
          name: company.companyName,
          nature: company.companyNature,
          phone: `${countryCode}${area}${phone}`,
          subject: company.companySubject,
          type: company.companyType,
          openingDate: company.openingDate,
          exemptStateRegistration: company.exemptStateRegistration,
          stateRegistration: company.stateRegistration,
          monthlyInvoicing: Number(company.monthlyInvoicing) / 100,
          moduleClientId: '',
          operators: company.operators,
          establishmentId: data.establishmentId,
          approvedDate: company.approved_date || null,
          account: {
            accountNumber: account.account_number,
            accountType: account.account_type,
            baasAccountId: company.accountId || '',
            bankNumber: account.bank_number,
            branchNumber: account.branch_number,
            branchDigit: account.branch_digit,
          },
          partnersPF:
            partnersPFBaaS.length > 0
              ? partnersPFBaaS.map((pf) => ({
                document: pf.documentNumber,
                documentType: PartnerTypeEnum.cpf,
                name: pf.documentNumber,
                birthday_date: pf.birthdayDate,
                city: pf.address.city,
                country: pf.address.country,
                complement: pf.address.complement || '',
                neighborhood: pf.address.neighborhood,
                number: pf.address.number,
                state: pf.address.state,
                street: pf.address.street,
                zip: pf.address.zip,
                phone: `${pf.phone.countryCode}${pf.phone.area}${pf.phone.phone}`,
              }))
              : [],
          partnersPJ:
            partnersPJBaaS.length > 0
              ? partnersPJBaaS.map((pj) => ({
                document: pj.documentNumber,
                name: pj.companyName,
                documentType: PartnerTypeEnum.cnpj,
              }))
              : [],
        });

        if (clientCreated.isFail())
          return response.status(HttpStatus.BAD_REQUEST).json({
            message: clientCreated.error(),
          });

        return response.json(clientCreated.value());
      }

      const individualClient = await makeCreateIndividualClient().execute({
        document: documentOnlyNumbers,
        integrationId: request.integrationId
      })

      if (individualClient.isFail()) return Result.fail(individualClient.error())

      return response.json(individualClient.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get()
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getAll(
    @Query() query: ListClientsDTORequest,
    @Res() response: Response,
  ) {
    try {
      const result = await makeGetAllClients().execute({
        page: Number(query.page ?? 1),
        pageSize: Number(query.pageSize ?? 10),
        filters: {
          onlyAcquiring: false,
          document: query.document,
          name: query.name,
          approvedDateEnd: query.approvedDateEnd,
          approvedDateStart: query.approvedDateStart,
        },
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get('/services')
  async getServicesActive(@Req() req: CustomRequest, @Res() res: Response) {
    try {
      const result = await makeGetClientServices().execute({
        clientId: req.clientId,
      });

      if (result.isFail())
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return res.json(result.value());
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('/:id')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getById(@Param('id') id: string, @Res() response: Response) {
    try {
      const result = await makeGetClientById().execute({ clientId: id });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get('/economic-group/:id')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getByEconomicGroup(@Param('id') id: string, @Res() response: Response) {
    try {
      const result = await makeGetClientsByEconomicGroup().execute({
        economicGroupId: id,
      });

      if (result.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get('/baas/:document')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async getBaaSDocument(
    @Param('document') document: string,
    @Res() response: Response,
  ) {
    try {
      const result = await makeGetClientFromBaaS().execute({
        document
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });
      }

      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Put('/:id')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async update(
    @Param('id') id: string,
    @Res() response: Response,
    @Body() data: UpdateClientDTO,
  ) {
    try {
      const result = await makeUpdateClient().execute({
        id,
        economicGroupId: data.economicGroupId,
        establishmentId: data.establishmentId,
        standardServices: data.standardServices,
      });

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });
      }
      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Post('/external')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async createClientExternal(
    @Body() data: CreateClientByIntegrationDTO,
    @Res() response: Response,
    // @Req() request: CustomRequest,
  ) {
    try {
      const client = await makeCreateClientIntegration().execute(data);

      if (client.isFail())
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: client.error(),
        });

      return response.json(client.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Post('/find-new-clients')
  @Permissions(Permission.admin, Permission.manager, Permission.backoffice)
  async findNewClients(@Res() response: Response) {
    try {
      const result = await makeCreateNewClientsBaaS().execute();

      if (result.isFail()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: result.error(),
        });
      }
      return response.json(result.value());
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
