import { UserActionTypeEnum } from '@modules/user/utils';

//Itens do menu

type Item = {
  link: string;
  label: string;
  actions?: UserActionTypeEnum[];
};
type ItemMenu = Item & {
  subItem?: Item[];
};

export type UserMenu = {
  items: ItemMenu[];
};

const inicio: ItemMenu = {
  link: '/',
  label: 'Início',
  actions: [],
  subItem: [],
};

const integracoes: ItemMenu = {
  link: '/integrations',
  label: 'Integrações',
  actions: [],
  subItem: [],
};

const usuarios: ItemMenu = {
  link: '/users',
  label: 'Usuários',
  actions: [],
  subItem: [],
};

const gruposEconomicos: ItemMenu = {
  link: '/economic-groups',
  label: 'Grupos econômicos',
  actions: [],
  subItem: [],
};

const clientes: ItemMenu = {
  link: '/clients',
  label: 'Clientes',
  actions: [],
  subItem: [],
};

const planosTarifas: ItemMenu = {
  link: '',
  label: 'Planos e tarifas',
  actions: [],
  subItem: [],
};

const monitoramentoConta: ItemMenu = {
  link: '/',
  label: 'Monitoramento',
  actions: [],
  subItem: [],
};

const contratos: ItemMenu = {
  link: '/',
  label: 'Contratos',
  actions: [],
  subItem: [],
};
// const monitoramentoConta: ItemMenu = {
//   link: '/account-monitoring',
//   label: 'Monitoramento de contas',
//   actions: [],
//   subItem: [],
// };

const adquirencia: ItemMenu = {
  link: '/',
  label: 'Adquirência',
  actions: [],
  subItem: [],
};

const capitalDeGiro: ItemMenu = {
  link: '/',
  label: 'Capital de giro',
  actions: [],
  subItem: [],
};

const antecipacaoDeDuplicatas: ItemMenu = {
  link: '/',
  label: 'Antecipação de duplicatas',
  actions: [],
  subItem: [],
};

const operacaoRiscoSacado: ItemMenu = {
  link: '/',
  label: 'Op. Risco Sacado',
  actions: [],
  subItem: [],
};

//Sub itens do menu

// Contratos
const templates: ItemMenu = {
  link: '/contracts/templates',
  label: 'Templates',
  actions: [],
};

const gerarContrato: ItemMenu = {
  link: '/contracts/generate',
  label: 'Gerar Documentos',
  actions: [],
};

//Monitoramento

const saldo: ItemMenu = {
  link: '/account-monitoring/balance',
  label: 'Saldos',
  actions: [],
};

const boleto: ItemMenu = {
  link: '/account-monitoring/bills',
  label: 'Boletos',
  actions: [],
};

//Planos e tarifas
const listarPlanos: ItemMenu = {
  link: '/plans/list',
  label: 'Listar planos',
  actions: [],
};

const atribuirPlano: ItemMenu = {
  link: '/plans/apply-accounts',
  label: 'Atribuir plano',
  actions: [],
};

//Adquirencia
const agenda: ItemMenu = {
  link: '/acquiring/receivables',
  label: 'Agenda',
  actions: [],
};

const transacoes: ItemMenu = {
  link: '/acquiring/transactions',
  label: 'Transações',
  actions: [],
};

const relatorio: ItemMenu = {
  link: '/acquiring/report',
  label: 'Relatório',
  actions: [],
};

//Capital de giro
const operacoes: ItemMenu = {
  link: '/spin/operations',
  label: 'Operações',
  actions: [],
};

const regrasDeCredito: ItemMenu = {
  link: '/spin/rating-rule',
  label: 'Regras de crédito',
  actions: [],
};

const tomadores: ItemMenu = {
  link: '/spin/borrowers',
  label: 'Tomadores',
  actions: [],
};

const analisarTomadores: ItemMenu = {
  link: '/spin/analysing-borrower',
  label: 'Analisar Tomadores',
  actions: [],
};

// Antecipação de duplicatas
const usuariosAd: ItemMenu = {
  link: '/antecipation/users',
  label: 'Usuários',
  actions: [],
};

const empresas: ItemMenu = {
  link: '/antecipation/partners',
  label: 'Empresas',
  actions: [],
};

const operacoesFornecedor: ItemMenu = {
  link: '/antecipation/operations',
  label: 'Operações',
  actions: [],
};

const fornecedores: ItemMenu = {
  link: '/antecipation/suppliers',
  label: 'Fornecedores',
  actions: [],
};

const notaFiscal: ItemMenu = {
  link: '/antecipation/invoices',
  label: 'Notas Fiscais',
  actions: [],
};

// Op. Risco Sacado
const sptEmpresas: ItemMenu = {
  link: '/spt-anticipation/partners',
  label: 'Sacados',
  actions: [],
};

const sptOperacoes: ItemMenu = {
  link: '/spt-anticipation/operations',
  label: 'Operações Sacados',
  actions: [],
};

const sptFornecedores: ItemMenu = {
  link: '/spt-anticipation/suppliers',
  label: 'Provedores',
  actions: [],
};

const sptNotaFiscal: ItemMenu = {
  link: '/spt-anticipation/invoices',
  label: 'Duplicatas',
  actions: [],
};

const sptRules: ItemMenu = {
  link: '/spt-anticipation/rule',
  label: 'Regras',
  actions: [],
};

//Menus
const admin: UserMenu = {
  items: [
    inicio,
    {
      ...integracoes,
      actions: [
        UserActionTypeEnum.create,
        UserActionTypeEnum.update,
        UserActionTypeEnum.read,
        UserActionTypeEnum.delete,
      ],
    },
    {
      ...usuarios,
      actions: [
        UserActionTypeEnum.create,
        UserActionTypeEnum.update,
        UserActionTypeEnum.read,
        UserActionTypeEnum.delete,
      ],
    },
    {
      ...gruposEconomicos,
      actions: [
        UserActionTypeEnum.create,
        UserActionTypeEnum.update,
        UserActionTypeEnum.read,
        UserActionTypeEnum.delete,
      ],
    },
    {
      ...contratos,
      subItem: [
        {
          ...templates,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...gerarContrato,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...clientes,
      actions: [
        UserActionTypeEnum.create,
        UserActionTypeEnum.update,
        UserActionTypeEnum.read,
        UserActionTypeEnum.delete,
      ],
    },
    {
      ...monitoramentoConta,
      subItem: [
        {
          ...saldo,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...boleto,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...planosTarifas,
      subItem: [
        listarPlanos,
        {
          ...atribuirPlano,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...adquirencia,
      subItem: [
        {
          ...agenda,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...transacoes,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...relatorio,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...capitalDeGiro,
      subItem: [
        operacoes,
        {
          ...regrasDeCredito,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...tomadores,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...analisarTomadores,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...antecipacaoDeDuplicatas,
      subItem: [
        {
          ...empresas,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...usuariosAd,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },

        {
          ...fornecedores,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...notaFiscal,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...operacoesFornecedor,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...operacaoRiscoSacado,
      subItem: [
        {
          ...sptRules,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...sptEmpresas,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...sptFornecedores,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...sptNotaFiscal,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...sptOperacoes,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
  ],
};

const manager: UserMenu = {
  items: [
    inicio,
    {
      ...gruposEconomicos,
      actions: [
        UserActionTypeEnum.create,
        UserActionTypeEnum.update,
        UserActionTypeEnum.read,
        UserActionTypeEnum.delete,
      ],
    },
    {
      ...clientes,
      actions: [
        UserActionTypeEnum.create,
        UserActionTypeEnum.update,
        UserActionTypeEnum.read,
        UserActionTypeEnum.delete,
      ],
    },
    {
      ...contratos,
      subItem: [
        {
          ...templates,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...gerarContrato,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...monitoramentoConta,
      subItem: [
        {
          ...saldo,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...boleto,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...planosTarifas,
      subItem: [
        listarPlanos,
        {
          ...atribuirPlano,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...adquirencia,
      subItem: [
        {
          ...agenda,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...transacoes,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...relatorio,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...capitalDeGiro,
      subItem: [
        operacoes,
        {
          ...regrasDeCredito,
          actions: [UserActionTypeEnum.read],
        },
        { ...tomadores, actions: [UserActionTypeEnum.read] },
        {
          ...analisarTomadores,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...antecipacaoDeDuplicatas,
      subItem: [
        {
          ...empresas,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...usuariosAd,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },

        {
          ...fornecedores,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...notaFiscal,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...operacoesFornecedor,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...operacaoRiscoSacado,
      subItem: [
        {
          ...sptRules,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...sptEmpresas,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...sptFornecedores,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
          ],
        },
        {
          ...sptNotaFiscal,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
          ],
        },
        {
          ...sptOperacoes,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
          ],
        },
      ],
    },
  ],
};

const backoffice: UserMenu = {
  items: [
    inicio,
    {
      ...gruposEconomicos,
      actions: [
        UserActionTypeEnum.create,
        UserActionTypeEnum.update,
        UserActionTypeEnum.read,
        UserActionTypeEnum.delete,
      ],
    },
    {
      ...clientes,
      actions: [
        UserActionTypeEnum.update,
        UserActionTypeEnum.read,
        UserActionTypeEnum.delete,
        UserActionTypeEnum.create,
      ],
    },
    {
      ...contratos,
      subItem: [
        {
          ...templates,
          actions: [UserActionTypeEnum.read],
        },
        {
          ...gerarContrato,
          actions: [UserActionTypeEnum.create],
        },
      ],
    },
    {
      ...monitoramentoConta,
      subItem: [
        {
          ...saldo,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...boleto,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...planosTarifas,
      subItem: [
        {
          ...listarPlanos,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...atribuirPlano,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...adquirencia,
      subItem: [
        {
          ...agenda,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...transacoes,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...relatorio,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
      ],
    },
    {
      ...capitalDeGiro,
      subItem: [
        operacoes,
        { ...tomadores, actions: [UserActionTypeEnum.read] },
      ],
    },
    {
      ...antecipacaoDeDuplicatas,
      subItem: [
        {
          ...empresas,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...usuariosAd,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },

        {
          ...fornecedores,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...notaFiscal,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
          ],
        },
        {
          ...operacoesFornecedor,
          actions: [UserActionTypeEnum.read],
        },
      ],
    },
    {
      ...operacaoRiscoSacado,
      subItem: [
        {
          ...sptRules,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...sptEmpresas,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
            UserActionTypeEnum.delete,
          ],
        },
        {
          ...sptFornecedores,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
          ],
        },
        {
          ...sptNotaFiscal,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
          ],
        },
        {
          ...sptOperacoes,
          actions: [
            UserActionTypeEnum.create,
            UserActionTypeEnum.update,
            UserActionTypeEnum.read,
          ],
        },
      ],
    },
  ],
};

const read: UserMenu = {
  items: [
    inicio,
    { ...capitalDeGiro, subItem: [operacoes] },
    { ...antecipacaoDeDuplicatas, subItem: [notaFiscal, operacoesFornecedor] },
  ],
};

export const menuInterfaces = {
  admin: () => {
    return admin;
  },
  manager: () => {
    return manager;
  },
  backoffice: () => {
    return backoffice;
  },
  read: () => {
    return read;
  },
};
