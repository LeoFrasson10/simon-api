import { ServiceIntegration } from '@modules/service-integration';
import { MakeCryptoProvider } from '@shared/providers';
import { DefaultAggregateProps } from '@shared/types';
import { Aggregate, Result } from 'types-ddd';

type IntegrationProps = DefaultAggregateProps & {
  name: string;
  email: string;
  active?: boolean;
  autoApproved?: boolean;
  dueDate?: Date;
  origin?: string;
  document?: string;
  credentials?: string;
  key?: string;
  fullAccess?: boolean;
  integrationService?: Array<Result<ServiceIntegration>>;

  details?: string;
};

export type IntegrationCredentials = {
  baas: BaaSCredencials;
};

type BaaSCredencials = {
  url: string;
  key: string;
  user: User;
};

type User = {
  email: string;
  password: string;
};

export class Integration extends Aggregate<IntegrationProps> {
  constructor(props: IntegrationProps) {
    super(props);
  }

  public static isValid({ name, email }: IntegrationProps): Result<void> {
    const { string } = this.validator;

    if (string(name).isEmpty()) {
      return Result.fail('Nome é obrigatório');
    }

    if (string(email).isEmpty()) {
      return Result.fail('Email é obrigatório');
    }

    return Result.Ok();
  }

  public static create(props: IntegrationProps): Result<Integration> {
    const isValid = Integration.isValid(props);

    if (isValid.isFail()) return Result.fail(isValid.error());

    return Result.Ok(new Integration(props));
  }

  public update(props: IntegrationProps, details?: string): Result<void> {
    this.change('name', props.name);
    this.change('origin', props.origin);
    this.change('document', props.document);
    this.change('autoApproved', props.autoApproved);
    this.change('active', props.active);

    if (details) {
      this.change('details', details);
    }

    return Result.Ok();
  }

  public async getCredentials(): Promise<Result<IntegrationCredentials>> {
    const encryptation = MakeCryptoProvider.getProvider();

    const decrypted = await encryptation.publicDecryptHash(
      this.get('credentials'),
    );

    if (decrypted.isFail()) {
      return Result.fail(decrypted.error());
    }

    const credentialsData = JSON.parse(decrypted.value());

    return Result.Ok({
      baas: credentialsData?.baas,
    });
  }

  public getLastService(): Result<ServiceIntegration> {
    if (this.get('integrationService').length > 0) {
      return Result.Ok(this.get('integrationService')[0].value());
    }

    return Result.fail('Nenhum serviço encontrado');
  }
}
