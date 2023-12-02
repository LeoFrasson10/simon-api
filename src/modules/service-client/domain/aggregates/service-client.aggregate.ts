import { DefaultAggregateProps } from '@shared/types';
import { Aggregate, Result, UID } from 'types-ddd';

type ServiceClientProps = DefaultAggregateProps & {
  clientId: UID;
  keys: string[];
};

export class ServiceClient extends Aggregate<ServiceClientProps> {
  constructor(props: ServiceClientProps) {
    super(props);
  }

  public static isValid({ clientId }: ServiceClientProps): Result<void> {
    const { string } = this.validator;

    if (string(clientId.value()).isEmpty()) {
      return Result.fail('Cliente é obrigatório');
    }

    return Result.Ok();
  }

  public static create(props: ServiceClientProps): Result<ServiceClient> {
    const isValid = ServiceClient.isValid(props);

    if (isValid.isFail()) return Result.fail(isValid.error());

    return Result.Ok(new ServiceClient(props));
  }
}
