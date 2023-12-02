import { ID, IUseCase, Result } from 'types-ddd';
import {
  CreateContractUseCaseDTOInput,
  CreateContractUseCaseDTOOutput,
} from './dtos';
import { Contract, IContractRepository } from '@modules/contracts/domain';
import { IDateProvider, IFileBucketProvider } from '@shared/providers';

type Input = CreateContractUseCaseDTOInput;
type Output = CreateContractUseCaseDTOOutput;

export class CreateContract implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly contractRepository: IContractRepository,
    private readonly fileBucketProvider: IFileBucketProvider,
    private readonly dateProvider: IDateProvider,
  ) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const isValidInput = this.validateInput(data);
    if (isValidInput.isFail()) return Result.fail(isValidInput.error());

    const newContract = Contract.create({
      description: data.description,
      title: data.title,
      version: 1,
      userId: ID.create(data.userId),
      details: `Novo contrato`,
      useSpreadsheet: data.useSpreadsheet && data.useSpreadsheet === 'true',
    });

    if (newContract.isFail()) {
      return Result.fail(newContract.error());
    }

    const contractInstance = newContract.value();

    const formattedDateNow = this.dateProvider.maskDate({
      date: new Date(),
      mask: 'ddMMyyyyHHmmss',
      timezone: 'America/Sao_Paulo',
    });

    const filename = `${formattedDateNow}-v${contractInstance
      .get('version')
      .toString()}-${data.file.originalname}`;

    const fileCreated = await this.fileBucketProvider.createFromBuffer({
      data: data.file.buffer,
      fileName: filename,
      prefix: `contracts-templates`,
    });

    if (fileCreated.isFail()) return Result.fail(fileCreated.error());

    contractInstance.setFile(filename, `contracts-templates/${filename}`);

    const createdContract = await this.contractRepository.create(
      contractInstance,
    );

    if (createdContract.isFail()) return Result.fail(createdContract.error());

    return Result.Ok({
      ...createdContract.value(),
    });
  }

  private validateInput(data: Input): Result<void> {
    if (!data.title) return Result.fail('campo title requerido');

    if (!data.file) return Result.fail('file requerido');

    if (!data.userId) return Result.fail('userId requerido');

    return Result.Ok();
  }
}
