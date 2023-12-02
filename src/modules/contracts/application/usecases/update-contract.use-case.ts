import { ID, IUseCase, Result } from 'types-ddd';
import {
  UpdateContractUseCaseDTOInput,
  UpdateContractUseCaseDTOOutput,
} from './dtos';
import { IContractRepository } from '@modules/contracts/domain';
import { IDateProvider, IFileBucketProvider } from '@shared/providers';

type Input = UpdateContractUseCaseDTOInput;
type Output = UpdateContractUseCaseDTOOutput;

export class UpdateContract implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly contractRepository: IContractRepository,
    private readonly fileBucketProvider: IFileBucketProvider,
    private readonly dateProvider: IDateProvider,
  ) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const contract = await this.contractRepository.findById(data.contractId);

    if (contract.isFail()) {
      return Result.fail(contract.error());
    }

    const contractInstance = contract.value();

    contractInstance.update({
      description: data.description ?? contractInstance.get('description'),
      title: data.title ?? contractInstance.get('title'),
      details: 'Alteração no contrato',
      userId: data.userId
        ? ID.create(data.userId)
        : contractInstance.get('userId'),
      filename: contractInstance.get('filename'),
      path: contractInstance.get('path'),
      useSpreadsheet:
        data.useSpreadsheet && data.useSpreadsheet === 'true' ? true : false,
    });

    if (data.file) {
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
    }

    const changedContract = await this.contractRepository.update(
      contractInstance,
    );

    if (changedContract.isFail()) return Result.fail(changedContract.error());

    return Result.Ok();
  }
}
