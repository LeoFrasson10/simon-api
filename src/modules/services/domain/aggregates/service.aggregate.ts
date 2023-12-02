import { DefaultAggregateProps } from '@shared/types';
import { Aggregate, Result } from 'types-ddd';

type ServiceProps = DefaultAggregateProps & {
  name: string;
  active?: boolean;
  label: string;
  key: string;
  standard: boolean;
};

export class Service extends Aggregate<ServiceProps> {
  constructor(props: ServiceProps) {
    super(props);
  }

  public static isValid({ name }: ServiceProps): Result<void> {
    const { string } = this.validator;

    if (string(name).isEmpty()) {
      return Result.fail('Nome do modulo é obrigatório');
    }

    return Result.Ok();
  }

  public static create(props: ServiceProps): Result<Service> {
    const isValid = Service.isValid(props);

    if (isValid.isFail()) return Result.fail(isValid.error());

    return Result.Ok(new Service(props));
  }
}
