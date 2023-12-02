import {
  makeCreateClient,
  makeGetClientByDocumentAndIntegration,
} from '@modules/client';
import {
  makeGetAllIntegrations,
  makeGetIntegrationById,
} from '@modules/integrations';
import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { generateJWT, isValidDocument } from '@shared/helpers';

import {
  MakeEncryptationDocumentProvider,
  makeCompany,
  makeHttpClient,
} from '@shared/providers';

import { Response, Request } from 'express';

import { AuthAppDTO, AuthIbDTO, SessionUserDTO } from './dtos';
import { discordWebhook } from '@shared/config';
import { PartnerTypeEnum } from '@shared/utils';
import {
  makeCreateBorrower,
  makeGetBorrowerByExternalId,
  makeGetSpinClientByIntegration,
} from '@modules/apis';
import {
  makeChangeApolloSupplierAssignor,
  makeCreateApolloAssignor,
  makeGetApolloAssignorByExternalId,
  makeGetApolloClientByIntegration,
  makeGetApolloSupplierByDocument,
} from '@modules/apis/apollo/application';
import { Logger } from 'types-ddd';
import { makeVerifyUser } from '@modules/user';
import { makeCreateNewClient } from '@modules/authorization/application';
import {
  makeChangeSputnikSupplier,
  makeGetSputnikSupplierByDocument,
} from '@modules/apis/sputnik/application';

@Controller('/authorization')
export class AuthorizationController {
  @Post('/app')
  async authApp(
    @Body() { document, clientId }: AuthAppDTO,
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<any> {
    try {
      if (!document || !clientId) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'CNPJ ou ClientID inválido',
        });
      }
      const { origin } = request.headers;
      const documentValid = isValidDocument('cnpj', document);
      if (!documentValid) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'CNPJ inválido',
        });
      }

      const integration = await makeGetIntegrationById().execute({
        integrationId: clientId,
      });

      if (integration.isFail())
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Não autorizado' });

      const integrationInstance = integration.value();

      if (integrationInstance.origin !== origin) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Não autorizado' });
      }

      const existClient = await makeGetClientByDocumentAndIntegration().execute(
        {
          document,
          integrationId: integrationInstance.id,
        },
      );

      const supplier = await makeGetApolloSupplierByDocument().execute({
        document: document,
        integrationId: integrationInstance.id,
      });

      const sputnikSupplier = await makeGetSputnikSupplierByDocument().execute({
        document: document,
        integrationId: integrationInstance.id,
      });

      if (!existClient.value()) {
        const clientCreated = await makeCreateNewClient().execute({
          document,
          integrationId: integrationInstance.id,
        });

        if (clientCreated.isFail()) {
          return response.status(HttpStatus.BAD_REQUEST).json({
            message: clientCreated.error(),
          });
        }

        const newClientValue = clientCreated.value();

        const { token } = generateJWT({
          clientID: newClientValue.id,
          integrationId: integrationInstance.id,
        });

        makeHttpClient().request({
          url: discordWebhook.webhook,
          method: 'post',
          body: {
            embeds: [
              {
                title: 'Novo cliente registrado',
                description: `
                  **Razão Social:** ${newClientValue.name}
                  **CNPJ:** ${newClientValue.document}
                  **Parceiro:** ${integrationInstance.name}-(${integrationInstance.id})
                `,
                color: 3034748,
              },
            ],
          },
        });
        if (integrationInstance.fullAccess) {
          makeGetSpinClientByIntegration()
            .execute({
              integrationId: integrationInstance.id,
            })
            .then((cl) => {
              const c = cl.value();
              makeCreateBorrower().execute({
                externalClientId: newClientValue.id,
                document: newClientValue.document,
                monthlyInvoicingOnboarding: Number(
                  newClientValue.monthlyInvoicing,
                ),
                monthlyInvoicing: 0,
                monthlyInvoicingEstimated: 0,
                clientId: c.id,
                ratingRuleId: null,
                name: newClientValue.name,
                integrationId: integrationInstance.id,
              });
            })
            .catch((e) => Logger.error(`Create Borrower: ${e.message}`));
        }

        makeGetApolloClientByIntegration()
          .execute({
            integrationId: integrationInstance.id,
          })
          .then((cl) => {
            const c = cl.value();
            makeCreateApolloAssignor()
              .execute({
                externalClientId: clientCreated.value().id,
                document: clientCreated.value().document,
                monthlyInvoicingOnboarding: Number(
                  clientCreated.value().monthlyInvoicing,
                ),
                monthlyInvoicing: 0,
                monthlyInvoicingEstimated: 0,
                clientId: c.id,
                ratingRuleId: null,
                name: newClientValue.name,
              })
              .then((res) => {
                if (res.isOk()) {
                  if (supplier.isOk()) {
                    const supplierValue = supplier.value();
                    if (!supplierValue.assignorId) {
                      makeChangeApolloSupplierAssignor()
                        .execute({
                          assignorId: res.value().id,
                          supplierId: supplier.value().id,
                        })
                        .then((res) => {
                          if (res.isOk()) {
                            Logger.info('Cedente vinculado ao fornecedor');
                          }
                        })
                        .catch((err) =>
                          Logger.error(
                            `Change Apollo Supplier: ${err.message}`,
                          ),
                        );
                    }
                  }
                }
              });
          })
          .catch((e) =>
            Logger.error(`Get Apollo ClientByIntegration: ${e.message}`),
          );

        if (
          sputnikSupplier.value() &&
          !sputnikSupplier.value().externalClientId
        ) {
          const changedSupplierSputnik =
            await makeChangeSputnikSupplier().execute({
              externalClientId: newClientValue.id,
              integrationId: integrationInstance.id,
              sputnikSupplierId: sputnikSupplier.value().id,
            });

          if (changedSupplierSputnik.isFail()) {
            Logger.error(changedSupplierSputnik.error());
          }

          Logger.info('Fornecedor vinculado SPUTNIK');
        }

        return response.status(HttpStatus.OK).json({
          token,
          client: {
            id: newClientValue.id,
            name: newClientValue.name,
            document: newClientValue.document,
            services: newClientValue?.serviceClient?.modulesKeys,
            clientId: integrationInstance.id,
          },
        });
      }
      const client = existClient.value();

      const [borrower, assignor] = await Promise.all([
        makeGetBorrowerByExternalId().execute({
          clientId: client.id,
          integrationId: integrationInstance.id,
        }),
        makeGetApolloAssignorByExternalId().execute({
          clientId: client.id,
          integrationId: integrationInstance.id,
        }),
      ]);
      if (integrationInstance.fullAccess) {
        if (borrower.isFail()) {
          if (borrower.error() === 'Tomador não encontrado') {
            makeGetSpinClientByIntegration()
              .execute({
                integrationId: integrationInstance.id,
              })
              .then((cl) => {
                const c = cl.value();
                makeCreateBorrower()
                  .execute({
                    externalClientId: client.id,
                    document: client.document,
                    monthlyInvoicingOnboarding: Number(client.monthlyInvoicing),
                    monthlyInvoicing: 0,
                    monthlyInvoicingEstimated: 0,
                    clientId: c.id,
                    ratingRuleId: null,
                    name: client.name,
                    integrationId: integrationInstance.id,
                  })
                  .then((r) => {
                    if (r.isOk()) {
                      makeHttpClient().request({
                        url: discordWebhook.webhook,
                        method: 'post',
                        body: {
                          embeds: [
                            {
                              title:
                                'Novo cliente registrado para consulta de crédito',
                              description: `
                              **Razão Social:** ${client.name}
                              **CNPJ:** ${client.document}
                              **Parceiro:** ${integrationInstance.name}-(${integrationInstance.id})
                            `,
                              color: 3034748,
                            },
                          ],
                        },
                      });
                    }
                  });
              });
          }
        }
      }

      if (assignor.isFail() && assignor.error() === 'Cedente não encontrado') {
        makeGetApolloClientByIntegration()
          .execute({
            integrationId: integrationInstance.id,
          })
          .then((cl) => {
            const c = cl.value();
            makeCreateApolloAssignor()
              .execute({
                externalClientId: client.id,
                document: client.document,
                monthlyInvoicingOnboarding: Number(client.monthlyInvoicing),
                monthlyInvoicing: 0,
                monthlyInvoicingEstimated: 0,
                clientId: c.id,
                ratingRuleId: null,
                name: client.name,
              })
              .then((r) => {
                if (r.isOk()) {
                  makeHttpClient().request({
                    url: discordWebhook.webhook,
                    method: 'post',
                    body: {
                      embeds: [
                        {
                          title:
                            'Novo cliente registrado para consulta de crédito',
                          description: `
                              **Razão Social:** ${client.name}
                              **CNPJ:** ${client.document}
                              **Parceiro:** ${integrationInstance.name}-(${integrationInstance.id})
                            `,
                          color: 3034748,
                        },
                      ],
                    },
                  });

                  if (supplier.isOk()) {
                    const supplierValue = supplier.value();
                    if (!supplierValue.assignorId) {
                      makeChangeApolloSupplierAssignor()
                        .execute({
                          assignorId: r.value().id,
                          supplierId: supplier.value().id,
                        })
                        .then((res) => {
                          if (res.isOk()) {
                            Logger.info('Cedente vinculado ao fornecedor');
                          }
                        })
                        .catch((err) =>
                          Logger.error(
                            `BindApolloSupplierAssignor: ${
                              err.message || 'Erro ao vincular cedente'
                            }`,
                          ),
                        );
                    }
                  }
                }
              })
              .catch((e) => {
                Logger.error(`CreateApolloAssignor: ${e.message}`);
              });
          })
          .catch((e) => {
            Logger.error(`GetApolloClientByIntegration: ${e.message}`);
          });
      } else if (assignor.isOk()) {
        if (supplier.isOk()) {
          const supplierValue = supplier.value();
          if (!supplierValue.assignorId) {
            makeChangeApolloSupplierAssignor()
              .execute({
                assignorId: assignor.value().id,
                supplierId: supplier.value().id,
              })
              .then((res) => {
                if (res.isOk()) {
                  Logger.info('Cedente vinculado ao fornecedor');
                }
              })
              .catch((err) =>
                Logger.error(err.message || 'Erro ao vincular cedente'),
              );
          }
        }
      }

      if (
        sputnikSupplier.value() &&
        !sputnikSupplier.value().externalClientId
      ) {
        const changedSupplierSputnik =
          await makeChangeSputnikSupplier().execute({
            externalClientId: client.id,
            integrationId: integrationInstance.id,
            sputnikSupplierId: sputnikSupplier.value().id,
          });

        if (changedSupplierSputnik.isFail()) {
          Logger.error(changedSupplierSputnik.error());
        }

        Logger.info('Fornecedor vinculado SPUTNIK');
      }

      const { token } = generateJWT({
        clientID: client.id,
        integrationId: integrationInstance.id,
      });

      return response.status(HttpStatus.OK).json({
        token,
        client: {
          id: client.id,
          name: client.name,
          document: client.document,
          services: client.serviceClient.keys,
          clientId: integrationInstance.id,
        },
      });
    } catch (error) {
      console.log(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/ib')
  async authIb(
    @Body() { value, clientId }: AuthIbDTO,
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<any> {
    try {
      if (!value || !clientId) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Não autorizado',
        });
      }

      const { origin } = request.headers;

      const integration = await makeGetIntegrationById().execute({
        integrationId: clientId,
      });

      if (integration.isFail())
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Não autorizado' });

      const integrationInstance = integration.value();

      console.log({ ...integrationInstance, atual: origin });

      if (integrationInstance.origin !== origin) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Não autorizado' });
      }

      const encryptation = MakeEncryptationDocumentProvider.getProvider();

      const decryptedData = await encryptation.decryptPublicBaaSHash(value);
      console.log({ decryptedData });
      if (decryptedData.isFail()) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Não autorizado',
        });
      }

      if (typeof decryptedData.value() !== 'string') {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Não autorizado',
        });
      }

      const document = decryptedData.value();

      const documentValid = isValidDocument('cnpj', document);

      if (!documentValid) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'CNPJ inválido',
        });
      }

      const existClient = await makeGetClientByDocumentAndIntegration().execute(
        {
          document,
          integrationId: integrationInstance.id,
        },
      );

      const supplier = await makeGetApolloSupplierByDocument().execute({
        document: document,
        integrationId: integrationInstance.id,
      });
      const sputnikSupplier = await makeGetSputnikSupplierByDocument().execute({
        document: document,
        integrationId: integrationInstance.id,
      });

      if (!existClient.value()) {
        const clientCreated = await makeCreateNewClient().execute({
          document,
          integrationId: integrationInstance.id,
        });

        if (clientCreated.isFail()) {
          return response.status(HttpStatus.BAD_REQUEST).json({
            message: clientCreated.error(),
          });
        }

        const newClientValue = clientCreated.value();

        const { token } = generateJWT({
          clientID: newClientValue.id,
          integrationId: integrationInstance.id,
        });

        makeHttpClient().request({
          url: discordWebhook.webhook,
          method: 'post',
          body: {
            embeds: [
              {
                title: 'Novo cliente registrado para consulta de crédito',
                description: `
                  **Razão Social:** ${newClientValue.name}
                  **CNPJ:** ${newClientValue.document}
                  **Parceiro:** ${integrationInstance.name}-(${integrationInstance.id})
                `,
                color: 3034748,
              },
            ],
          },
        });
        if (integrationInstance.fullAccess) {
          makeGetSpinClientByIntegration()
            .execute({
              integrationId: integrationInstance.id,
            })
            .then((cl) => {
              const c = cl.value();
              makeCreateBorrower().execute({
                externalClientId: newClientValue.id,
                document: newClientValue.document,
                monthlyInvoicingOnboarding: Number(
                  newClientValue.monthlyInvoicing,
                ),
                monthlyInvoicing: 0,
                monthlyInvoicingEstimated: 0,
                clientId: c.id,
                ratingRuleId: null,
                name: newClientValue.name,
                integrationId: integrationInstance.id,
              });
            })
            .catch((e) => Logger.error(e.message));
        }

        makeGetApolloClientByIntegration()
          .execute({
            integrationId: integrationInstance.id,
          })
          .then((cl) => {
            const c = cl.value();
            makeCreateApolloAssignor()
              .execute({
                externalClientId: clientCreated.value().id,
                document: clientCreated.value().document,
                monthlyInvoicingOnboarding: Number(
                  clientCreated.value().monthlyInvoicing,
                ),
                monthlyInvoicing: 0,
                monthlyInvoicingEstimated: 0,
                clientId: c.id,
                ratingRuleId: null,
                name: newClientValue.name,
              })
              .then((res) => {
                if (res.isOk()) {
                  if (supplier.isOk()) {
                    const supplierValue = supplier.value();
                    if (!supplierValue.assignorId) {
                      makeChangeApolloSupplierAssignor()
                        .execute({
                          assignorId: res.value().id,
                          supplierId: supplier.value().id,
                        })
                        .then((res) => {
                          if (res.isOk()) {
                            Logger.info('Cedente vinculado ao fornecedor');
                          }
                        })
                        .catch((err) =>
                          Logger.error(
                            err.message || 'Erro ao vincular cedente',
                          ),
                        );
                    }
                  }
                }
              });
          })
          .catch((e) => Logger.error(e.message));

        if (
          sputnikSupplier.value() &&
          !sputnikSupplier.value().externalClientId
        ) {
          const changedSupplierSputnik =
            await makeChangeSputnikSupplier().execute({
              externalClientId: newClientValue.id,
              integrationId: integrationInstance.id,
              sputnikSupplierId: sputnikSupplier.value().id,
            });

          if (changedSupplierSputnik.isFail()) {
            Logger.error(changedSupplierSputnik.error());
          }

          Logger.info('Fornecedor vinculado SPUTNIK');
        }

        return response.status(HttpStatus.OK).json({
          token,
          client: {
            id: newClientValue.id,
            name: newClientValue.name,
            document: newClientValue.document,
            services: newClientValue?.serviceClient?.modulesKeys,
            clientId: integrationInstance.id,
          },
        });
      }

      const client = existClient.value();
      const [borrower, assignor] = await Promise.all([
        makeGetBorrowerByExternalId().execute({
          clientId: client.id,
          integrationId: integrationInstance.id,
        }),
        makeGetApolloAssignorByExternalId().execute({
          clientId: client.id,
          integrationId: integrationInstance.id,
        }),
      ]);

      if (borrower.isFail()) {
        if (borrower.error() === 'Tomador não encontrado') {
          makeGetSpinClientByIntegration()
            .execute({
              integrationId: integrationInstance.id,
            })
            .then((cl) => {
              const c = cl.value();
              makeCreateBorrower()
                .execute({
                  externalClientId: client.id,
                  document: client.document,
                  monthlyInvoicingOnboarding: Number(client.monthlyInvoicing),
                  monthlyInvoicing: 0,
                  monthlyInvoicingEstimated: 0,
                  clientId: c.id,
                  ratingRuleId: null,
                  name: client.name,
                  integrationId: integrationInstance.id,
                })
                .then((r) => {
                  if (r.isOk()) {
                    makeHttpClient().request({
                      url: discordWebhook.webhook,
                      method: 'post',
                      body: {
                        embeds: [
                          {
                            title:
                              'Novo cliente registrado para consulta de crédito',
                            description: `
                            **Razão Social:** ${client.name}
                            **CNPJ:** ${client.document}
                            **Parceiro:** ${integrationInstance.name}-(${integrationInstance.id})
                          `,
                            color: 3034748,
                          },
                        ],
                      },
                    });
                  }
                });
            });
        }
      }

      if (assignor.isFail() && assignor.error() === 'Cedente não encontrado') {
        makeGetApolloClientByIntegration()
          .execute({
            integrationId: integrationInstance.id,
          })
          .then((cl) => {
            const c = cl.value();
            makeCreateApolloAssignor()
              .execute({
                externalClientId: client.id,
                document: client.document,
                monthlyInvoicingOnboarding: Number(client.monthlyInvoicing),
                monthlyInvoicing: 0,
                monthlyInvoicingEstimated: 0,
                clientId: c.id,
                ratingRuleId: null,
                name: client.name,
              })
              .then((r) => {
                if (r.isOk()) {
                  makeHttpClient().request({
                    url: discordWebhook.webhook,
                    method: 'post',
                    body: {
                      embeds: [
                        {
                          title:
                            'Novo cliente registrado para consulta de crédito',
                          description: `
                              **Razão Social:** ${client.name}
                              **CNPJ:** ${client.document}
                              **Parceiro:** ${integrationInstance.name}-(${integrationInstance.id})
                            `,
                          color: 3034748,
                        },
                      ],
                    },
                  });

                  if (supplier.isOk()) {
                    const supplierValue = supplier.value();
                    if (!supplierValue.assignorId) {
                      makeChangeApolloSupplierAssignor()
                        .execute({
                          assignorId: r.value().id,
                          supplierId: supplier.value().id,
                        })
                        .then((res) => {
                          if (res.isOk()) {
                            Logger.info('Cedente vinculado ao fornecedor');
                          }
                        })
                        .catch((err) =>
                          Logger.error(
                            `BindApolloSupplierAssignor: ${
                              err.message || 'Erro ao vincular cedente'
                            }`,
                          ),
                        );
                    }
                  }
                }
              })
              .catch((e) => {
                Logger.error(`${e.message}`);
              });
          })
          .catch((e) => {
            Logger.error(`${e.message}`);
          });
      } else if (assignor.isOk()) {
        if (supplier.isOk()) {
          const supplierValue = supplier.value();
          if (!supplierValue.assignorId) {
            makeChangeApolloSupplierAssignor()
              .execute({
                assignorId: assignor.value().id,
                supplierId: supplier.value().id,
              })
              .then((res) => {
                if (res.isOk()) {
                  Logger.info('Cedente vinculado ao fornecedor');
                }
              })
              .catch((err) =>
                Logger.error(err.message || 'Erro ao vincular cedente'),
              );
          }
        }
      }

      if (
        sputnikSupplier.value() &&
        !sputnikSupplier.value().externalClientId
      ) {
        const changedSupplierSputnik =
          await makeChangeSputnikSupplier().execute({
            externalClientId: client.id,
            integrationId: integrationInstance.id,
            sputnikSupplierId: sputnikSupplier.value().id,
          });

        if (changedSupplierSputnik.isFail()) {
          Logger.error(changedSupplierSputnik.error());
        }

        Logger.info('Fornecedor vinculado SPUTNIK');
      }

      const { token } = generateJWT({
        clientID: client.id,
        integrationId: integrationInstance.id,
      });

      return response.status(HttpStatus.OK).json({
        token,
        client: {
          id: client.id,
          name: client.name,
          document: client.document,
          services: client.serviceClient.keys,
          clientId: integrationInstance.id,
        },
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Post('/ib/v2/:integrationId')
  async authByBaaS(
    @Param('integrationId') integrationId: string,
    @Body() { value }: AuthIbDTO,
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<any> {
    try {
      if (!value || !integrationId) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Não autorizado!',
        });
      }

      const integration = await makeGetIntegrationById().execute({
        integrationId: integrationId,
      });

      const origin = request.headers.origin;

      console.log({ origin });

      if (integration.isFail())
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Não autorizado' });

      const encryptation = MakeEncryptationDocumentProvider.getProvider();

      const decryptedData = await encryptation.decryptPublicBaaSHash(value);

      if (!decryptedData || decryptedData.isFail()) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Não autorizado',
        });
      }

      if (typeof decryptedData.value() !== 'string') {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Não autorizado',
        });
      }

      const document = decryptedData.value();

      const documentValid = isValidDocument(
        document.length === 11 ? 'cpf' : 'cnpj',
        document,
      );

      if (!documentValid) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Documento inválido',
        });
      }

      const integrationInstance = integration.value();

      const existClient = await makeGetClientByDocumentAndIntegration().execute(
        {
          document,
          integrationId: integrationInstance.id,
        },
      );

      const supplier = await makeGetApolloSupplierByDocument().execute({
        document: document,
        integrationId: integrationInstance.id,
      });

      if (!existClient.value()) {
        const baasResponse = await makeCompany().requestCompanyByDocument(
          document,
          integrationInstance.id,
        );

        if (baasResponse.isOk()) {
          const company = baasResponse.value().company;

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
            integrationId: integrationInstance.id,
            name: company.companyName,
            nature: company.companyNature,
            phone: `${countryCode}${area}${phone}`,
            subject: company.companySubject,
            type: company.companyType,
            openingDate: company.openingDate,
            exemptStateRegistration: company.exemptStateRegistration,
            stateRegistration: company.stateRegistration,
            monthlyInvoicing: company.monthlyInvoicing,
            moduleClientId: '',
            operators: company.operators,
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
                    name: pf.fullName,
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

          if (clientCreated.isFail()) {
            return response.status(HttpStatus.BAD_REQUEST).json({
              message: clientCreated.error(),
            });
          }
          const clientCreatedValue = clientCreated.value();
          const { token } = generateJWT({
            clientID: clientCreatedValue.id,
            integrationId: integrationInstance.id,
          });

          makeHttpClient().request({
            url: discordWebhook.webhook,
            method: 'post',
            body: {
              embeds: [
                {
                  title: 'Novo cliente registrado para consulta de crédito',
                  description: `
                  **Razão Social:** ${clientCreatedValue.name}
                  **CNPJ:** ${clientCreatedValue.document}
                  **Parceiro:** ${integrationInstance.name}-(${integrationInstance.id})
                `,
                  color: 3034748,
                },
              ],
            },
          });

          if (integrationInstance.name.toLocaleUpperCase() === 'FLOWBANCO') {
            makeGetSpinClientByIntegration()
              .execute({
                integrationId: integrationInstance.id,
              })
              .then((cl) => {
                const c = cl.value();

                makeCreateBorrower().execute({
                  externalClientId: clientCreatedValue.id,
                  document: clientCreatedValue.document,
                  monthlyInvoicingOnboarding: Number(
                    clientCreatedValue.monthlyInvoicing,
                  ),
                  monthlyInvoicing: 0,
                  monthlyInvoicingEstimated: 0,
                  clientId: c.id,
                  ratingRuleId: null,
                  name: company.companyName,
                  integrationId: integrationInstance.id,
                });
              });
          }
          makeGetApolloClientByIntegration()
            .execute({
              integrationId: integration.value().id,
            })
            .then((cl) => {
              const c = cl.value();
              makeCreateApolloAssignor()
                .execute({
                  externalClientId: clientCreatedValue.id,
                  document: clientCreatedValue.document,
                  monthlyInvoicingOnboarding: Number(
                    clientCreatedValue.monthlyInvoicing,
                  ),
                  monthlyInvoicing: 0,
                  monthlyInvoicingEstimated: 0,
                  clientId: c.id,
                  ratingRuleId: null,
                  name: company.companyName,
                })
                .then((res) => {
                  if (res.isOk()) {
                    if (supplier.isOk()) {
                      const supplierValue = supplier.value();
                      if (!supplierValue.assignorId) {
                        makeChangeApolloSupplierAssignor()
                          .execute({
                            assignorId: res.value().id,
                            supplierId: supplier.value().id,
                          })
                          .then((res) => {
                            if (res.isOk()) {
                              Logger.info('Cedente vinculado ao fornecedor');
                            }
                          })
                          .catch((err) =>
                            Logger.error(
                              err.message || 'Erro ao vincular cedente',
                            ),
                          );
                      }
                    }
                  }
                });
            });

          return response.status(HttpStatus.OK).json({
            token,
            client: {
              id: clientCreatedValue.id,
              name: clientCreatedValue.name,
              document: clientCreatedValue.document,
            },
          });
        } else {
          return Logger.error(`${baasResponse.error()}: ${document}`);
        }
      }

      const client = existClient.value();
      const assignor = await makeGetApolloAssignorByExternalId().execute({
        clientId: client.id,
        integrationId: integrationInstance.id,
      });

      if (assignor.isFail() && assignor.error() === 'Cedente não encontrado') {
        makeGetApolloClientByIntegration()
          .execute({
            integrationId: integrationInstance.id,
          })
          .then((r) => {
            if (r.isOk()) {
              makeCreateApolloAssignor()
                .execute({
                  externalClientId: client.id,
                  document: client.document,
                  monthlyInvoicingOnboarding: Number(client.monthlyInvoicing),
                  monthlyInvoicing: 0,
                  monthlyInvoicingEstimated: 0,
                  clientId: r.value().id,
                  ratingRuleId: null,
                  name: client.name,
                })
                .then((res) => {
                  if (res.isOk()) {
                    makeHttpClient().request({
                      url: discordWebhook.webhook,
                      method: 'post',
                      body: {
                        embeds: [
                          {
                            title:
                              'Novo cliente registrado para consulta de crédito',
                            description: `
                                **Razão Social:** ${client.name}
                                **CNPJ:** ${client.document}
                                **Parceiro:** ${integrationInstance.name}-(${integrationInstance.id})
                              `,
                            color: 3034748,
                          },
                        ],
                      },
                    });
                    if (supplier.isOk()) {
                      const supplierValue = supplier.value();
                      if (!supplierValue.assignorId) {
                        makeChangeApolloSupplierAssignor()
                          .execute({
                            assignorId: res.value().id,
                            supplierId: supplier.value().id,
                          })
                          .then((res) => {
                            if (res.isOk()) {
                              Logger.info('Cedente vinculado ao fornecedor');
                            }
                          })
                          .catch((err) =>
                            Logger.error(
                              err.message || 'Erro ao vincular cedente',
                            ),
                          );
                      }
                    }
                  }
                });
            }
          });
      } else if (assignor.isOk() && supplier.isOk()) {
        const supplierValue = supplier.value();
        if (!supplierValue.assignorId) {
          makeChangeApolloSupplierAssignor()
            .execute({
              assignorId: assignor.value().id,
              supplierId: supplier.value().id,
            })
            .then((res) => {
              if (res.isOk()) {
                Logger.info('Cedente vinculado ao fornecedor');
              }
            })
            .catch((err) =>
              Logger.error(err.message || 'Erro ao vincular cedente'),
            );
        }
      }

      const { token } = generateJWT({
        clientID: client.id,
        integrationId: integrationInstance.id,
      });

      return response.status(HttpStatus.OK).json({
        token,
        client: {
          id: client.id,
          name: client.name,
          document: client.document,
        },
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Post('/session')
  async session(
    @Body() body: SessionUserDTO,
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<any> {
    try {
      const { email, password } = body;
      if (!email || !password) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Informe suas credendiais',
        });
      }
      // const tokenIntegration = request.headers['subscription-key'] as string;

      // const integrationIsValid = verifyJWTIntegration(tokenIntegration);

      // if (!integrationIsValid) {
      //   return response.status(HttpStatus.UNAUTHORIZED).json({
      //     message: 'Token inválido',
      //   });
      // }

      // const integration = await makeGetIntegrationById().execute({
      //   integrationId: integrationIsValid.integrationId,
      // });

      const integration = await makeGetAllIntegrations().execute({
        page: 1,

        pageSize: 10,
        filters: {
          name: 'Flowbanco',
        },
      });

      if (integration.isFail())
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Não autorizado' });

      const integrationInstance = integration.value().data;

      if (
        integrationInstance.length > 0 &&
        integrationInstance[0].name.toLowerCase() !== 'flowbanco'
      )
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Não autorizado' });

      const result = await makeVerifyUser().execute({
        password,
        email,
      });

      if (result.isFail()) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: result.error() });
      }

      const user = result.value();

      const token = generateJWT({
        userId: user.id,
        integrationId: integrationInstance[0].id,
      });

      return response.status(HttpStatus.OK).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
