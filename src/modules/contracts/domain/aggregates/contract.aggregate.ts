import { DefaultAggregateProps } from '@shared/types';
import { Aggregate, Result, UID } from 'types-ddd';
import { User } from '@modules/user';

type Props = DefaultAggregateProps & {
  title: string;
  description: string;
  version?: number;
  filename?: string;
  path?: string;
  details?: string;
  useSpreadsheet?: boolean;
  userId?: UID;
  user?: Result<User>;
};

export class Contract extends Aggregate<Props> {
  constructor(props: Props) {
    super(props);
  }

  public static isValid(data: Props): Result<void> {
    const { title } = data;
    const { string } = this.validator;

    if (string(title).isEmpty()) {
      return Result.fail('title é obrigatório');
    }

    return Result.Ok();
  }

  public incrementVersion(): Result<void> {
    this.set('version').to(this.get('version') + 1);

    return Result.Ok();
  }

  public setFile(filename: string, path?: string): Result<void> {
    this.change('filename', filename);

    if (path) this.change('path', path);

    return Result.Ok();
  }

  public update(data: Props): Result<void> {
    this.incrementVersion();

    this.change('filename', data.filename);
    this.change('title', data.title);
    this.change('description', data.description);
    this.change('path', data.path);
    this.change('userId', data.userId);
    this.change('details', data.details);
    this.change('useSpreadsheet', data.useSpreadsheet);

    return Result.Ok();
  }

  public static create(props: Props): Result<Contract> {
    const isValid = Contract.isValid(props);

    if (isValid.isFail()) return Result.fail(isValid.error());

    return Result.Ok(new Contract(props));
  }
}
