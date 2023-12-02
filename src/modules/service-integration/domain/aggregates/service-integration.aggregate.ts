import { DefaultAggregateProps } from '@shared/types';
import { Aggregate, Result, UID } from 'types-ddd';

type ServiceIntegrationProps = DefaultAggregateProps & {
  integrationId: UID;
  serviceIds: string[];
};

export class ServiceIntegration extends Aggregate<ServiceIntegrationProps> {
  constructor(props: ServiceIntegrationProps) {
    super(props);
  }

  public static isValid({
    integrationId,
  }: ServiceIntegrationProps): Result<void> {
    const { string } = this.validator;

    if (string(integrationId.value()).isEmpty()) {
      return Result.fail('Integração Id é obrigatório');
    }

    return Result.Ok();
  }

  public static create(
    props: ServiceIntegrationProps,
  ): Result<ServiceIntegration> {
    const isValid = ServiceIntegration.isValid(props);

    if (isValid.isFail()) return Result.fail(isValid.error());

    return Result.Ok(new ServiceIntegration(props));
  }
}
