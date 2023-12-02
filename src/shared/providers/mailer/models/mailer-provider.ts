import { Readable } from 'stream';
import { Result } from 'types-ddd';

export type IEmail = {
  from?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  template?: {
    type: EmailTemplate;
    data: { [key: string]: any };
  };
  text?: string | Buffer | Readable;
  html?: string | Buffer | Readable;
  attachments?: IAttachments[];
};

export enum EmailTemplate {
  TEMPLATE_NOVO_USUARIO = 'novo-usuario-portal',
  TEMPLATE_AP_NOVO_USUARIO = 'ap-novo-usuario',
  TEMPLATE_AP_APROVACAO_DUPLICATAS = 'ap_aprovacao_duplicatas',
  TEMPLATE_AP_APROVACAO_DUPLICATAS_MESA = 'ap_aprovacao_duplicatas_mesa',
  TEMPLATE_AP_DUPLICATAS_DISPONIVEIS = 'ap_duplicatas_disponiveis',
  TEMPLATE_AP_CORRECAO_DUPLICATA = 'ap_correcao_duplicata',
  TEMPLATE_AP_UPLOAD_CORRECAO_DUPLICATA = 'ap_upload_correcao_duplicata',
  TEMPLATE_AP_NOTAS_FISCAIS_DE_SERVICO = 'ap-notas-fiscais-de-seviço',
}

export type IAttachments = {
  filename: string;
  content: string | Buffer | Readable;
  contentType?: string;
};

export interface IMailerProvider {
  sendEmail(email: IEmail): Promise<Result<void>>;
}
