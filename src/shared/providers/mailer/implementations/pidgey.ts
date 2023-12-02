/* eslint-disable @typescript-eslint/ban-types */
import { Result } from 'types-ddd';
import FormData from 'form-data';

import { Mailer } from '@shared/config';
import { IMailerProvider, IEmail } from '../models';
import { IHttpClient } from '@shared/providers/http';

type Params = {
  url: string;
  body: any;
  headers: FormData.Headers;
};

export class PidgeyProvider implements IMailerProvider {
  constructor(private readonly httpClient: IHttpClient) {}

  public async sendEmail({
    from,
    to,
    subject,
    template,
    text,
    attachments,
    html,
  }: IEmail): Promise<Result<void>> {
    try {
      const params = this.makeRequestParams({
        from: Mailer.fromEmail,
        to,
        subject,
        template,
        text,
        attachments,
        html,
      });

      const response = await this.httpClient.request({
        url: params.url,
        method: 'post',
        headers: {
          Authorization: `Pidgey ${Mailer.Pidgey.Token}`,
          ...params.headers,
        },
        body: params.body,
      });

      if (response.isFail()) {
        return Result.fail('error sending email');
      }

      return Result.Ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  private makeRequestParams(data: IEmail): Params {
    const baseURL = `${Mailer.Pidgey.URL}/email`;
    let route = '';

    if ((data.attachments && data.attachments.length > 0) || data.html) {
      if (data.html && data.html != '') {
        route = '/send-attachment-html';
      } else {
        route = !data.template
          ? '/send-attachment'
          : `/send-attachment-template/${data.template.type}`;
      }

      const params = this.makeFormDataParams(data);

      return {
        body: params,
        url: baseURL.concat(route),
        headers: params.getHeaders(),
      };
    }

    route = !data.template ? '/send' : `/send-template/${data.template.type}`;

    const body = {
      from: data.from ?? Mailer.fromEmail,
      to: data.to,
      subject: data.subject,
      body: data.text,
      fromTitle: Mailer.fromTitle,
      ...(data.template && {
        templateVars: data.template.data,
      }),
    };

    return {
      body,
      url: baseURL.concat(route),
      headers: {},
    };
  }

  private makeFormDataParams({
    from,
    to,
    subject,
    template,
    html,
    attachments,
  }: IEmail): FormData {
    const form = new FormData({});

    if (attachments && attachments.length > 0)
      attachments.forEach((file) => {
        form.append('attachment', file.content, file.filename);
      });

    form.append('from', from ?? Mailer.fromEmail, {
      contentType: 'fil',
    });
    form.append('to', to.join(','));
    form.append('subject', subject);
    if (html) form.append('html', html);
    form.append('fromTitle', Mailer.fromTitle);

    if (template) {
      for (const key in template.data) {
        if (Object.prototype.hasOwnProperty.call(template.data, key)) {
          form.append(key, template.data[key]);
        }
      }
    }

    return form;
  }
}
