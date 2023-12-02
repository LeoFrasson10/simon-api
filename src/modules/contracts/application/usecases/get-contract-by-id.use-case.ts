import { IUseCase, Result } from 'types-ddd';
import {
  GetContractUseCaseDTOInput,
  GetContractUseCaseDTOOutput,
} from './dtos';
import { IContractRepository } from '@modules/contracts/domain';

type Input = GetContractUseCaseDTOInput;
type Output = GetContractUseCaseDTOOutput;

export class GetContractById implements IUseCase<Input, Result<Output>> {
  constructor(private readonly contractRepository: IContractRepository) {}

  public async execute({ contractId }: Input): Promise<Result<Output>> {
    const contract = await this.contractRepository.findById(contractId);

    if (contract.isFail()) return Result.fail(contract.error());

    const contractInstance = contract.value();

    return Result.Ok({
      id: contractInstance.id.value(),
      title: contractInstance.get('title'),
      description: contractInstance.get('description'),
      version: contractInstance.get('version'),
      filename: contractInstance.get('filename'),
      path: contractInstance.get('path'),
      createdAt: contractInstance.get('createdAt'),
      useSpreadsheet: contractInstance.get('useSpreadsheet'),
    });
  }
}
