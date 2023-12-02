import { IUseCase, Result } from 'types-ddd';
import {
  FilesToConvert,
  GenerateClientContractUseCaseDTOInput,
  GenerateClientContractUseCaseDTOOutput,
} from './dtos';
import { IContractRepository } from '@modules/contracts/domain';
import { IDateProvider, IFileBucketProvider } from '@shared/providers';

import {
  // convertPDFAsync,
  createDocxtemplaterInstance,
  formatDocumentNumber,
  readFileAsync,
  removeSpecialCharacters,
} from '@shared/helpers';
import XlsxPopulate from 'xlsx-populate';

import archiver from 'archiver';
import * as fs from 'fs';
import { monthNames } from '@shared/utils';

type Input = GenerateClientContractUseCaseDTOInput;
type Output = GenerateClientContractUseCaseDTOOutput;

// const convertAsync = util.promisify(libre.convert);

export class GenerateClientContract implements IUseCase<Input, Result<Output>> {
  constructor(
    private readonly contractRepository: IContractRepository,
    private readonly fileBucketProvider: IFileBucketProvider,
    private readonly dateProvider: IDateProvider,
  ) {}

  public async execute(data: Input): Promise<Result<Output>> {
    const isValidInput = this.validateInput(data);
    if (isValidInput.isFail()) return Result.fail(isValidInput.error());

    const { contractId, client, file } = data;

    const contract = await this.contractRepository.findById(contractId);

    if (contract.isFail()) return Result.fail(contract.error());

    const contractInstance = contract.value();

    if (file && !contractInstance.get('useSpreadsheet'))
      return Result.fail('Contrato não pode ser gerado utilizando planilha');

    const contractTemplateBuffer = await this.fileBucketProvider.getFileBuffer(
      contractInstance.get('path'),
    );
    if (contractTemplateBuffer.isFail()) {
      return Result.fail(contractTemplateBuffer.error());
    }

    const outputDir = `./temp`;
    if (!fs.existsSync('./temp')) {
      fs.mkdirSync('./temp');
    }
    const formattedDateNow = this.dateProvider.maskDate({
      date: new Date(),
      mask: 'dd-MM-yyyy-HHmmss',
      timezone: 'America/Sao_Paulo',
    });

    const zipFileName = `contracts-${formattedDateNow}.zip`;
    const zipFilePath = `${outputDir}/${zipFileName}`;
    const zipStream = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonthNumber = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (client) {
      archive.pipe(zipStream);

      const doc = createDocxtemplaterInstance(contractTemplateBuffer.value());

      let TEXTBRANCH = '.';

      let BRANCHES = '';

      if (client.branches.length > 0) {
        TEXTBRANCH = ', e responsável pela(s) filial(is) abaixo:';
        BRANCHES = client.branches
          .map((b) => formatDocumentNumber(b))
          .join(';');
      }

      const docData = {
        ACCOUNT: client.accountNumber,
        NAME: client.name,
        DOCUMENT: formatDocumentNumber(client.document),
        ADDRESS: client.address,
        NEIGHBORHOOD: client.neighborhood,
        ZIP: client.zip,
        CITY: client.city,
        STATE: client.state,
        EMAIL: client.email,
        DAY: currentDay,
        MONTH: monthNames[currentMonthNumber],
        YEAR: currentYear.toString(),
        TEXTBRANCH,
        BRANCHES: client.branches.length > 0 ? `FILIAL (IS): ${BRANCHES}` : '',
      };

      doc.render(docData);
      const documentOnlyNumbers = removeSpecialCharacters(client.document);
      const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
      });
      const personType = documentOnlyNumbers.length === 14 ? 'PJ' : 'PF';
      const filenameToSave = `Minuta-PAC-${client.name}-${personType}`;

      archive.append(buf, { name: `${filenameToSave}.docx` });

      // const pdfBuf = await convertPDFAsync(buf, 'pdf', undefined);
      // archive.append(pdfBuf, { name: `${filenameToSave}.pdf` });

      await archive.finalize();
    } else {
      const clientFilePath = outputDir + '/plan.xlsx';
      fs.writeFileSync(clientFilePath, file.buffer);

      const processXLSX = (): Promise<Result<FilesToConvert[]>> => {
        const filesToConvert: FilesToConvert[] = [];

        return new Promise((resolve, reject) => {
          XlsxPopulate.fromFileAsync(clientFilePath)
            .then(async (workbook) => {
              const sheet = workbook.sheet(0);
              sheet
                .usedRange()
                .value()
                .forEach(async (row) => {
                  const [
                    ACCOUNT,
                    NAME,
                    DOCUMENT,
                    ADDRESS,
                    NEIGHBORHOOD,
                    ZIP,
                    CITY,
                    STATE,
                    EMAIL,
                  ] = row;
                  if (ACCOUNT && ACCOUNT !== 'ACCOUNT') {
                    const data = {
                      ACCOUNT,
                      NAME,
                      DOCUMENT,
                      ADDRESS,
                      NEIGHBORHOOD,
                      ZIP,
                      CITY,
                      STATE,
                      EMAIL,
                      DAY: currentDay,
                      MONTH: monthNames[currentMonthNumber],
                      YEAR: currentYear.toString(),
                      TEXTBRANCH: '',
                      BRANCHES: '',
                    };

                    const doc = createDocxtemplaterInstance(
                      contractTemplateBuffer.value(),
                    );

                    doc.render(data);

                    const buf = await doc.getZip().generate({
                      type: 'nodebuffer',
                      compression: 'DEFLATE',
                    });
                    const documentOnlyNumbers =
                      removeSpecialCharacters(DOCUMENT);
                    const personType =
                      documentOnlyNumbers.length === 14 ? 'PJ' : 'PF';
                    const filenameToSave = `Minuta-PAC-${NAME}-${personType}`;

                    filesToConvert.push({
                      filename: filenameToSave,
                      docxBuf: buf,
                    });
                  }
                });

              resolve(Result.Ok(filesToConvert));
              //
            })
            .catch((error) => {
              console.error('Erro ao gerar e converter arquivos:', error);
              reject(Result.fail(error));
            })
            .finally(async () => {
              fs.unlinkSync(clientFilePath);
            });
        });
      };

      const filesProcess = await processXLSX();
      if (filesProcess.isFail()) {
        return Result.fail(filesProcess.error());
      }

      if (filesProcess && filesProcess.value().length > 0) {
        archive.pipe(zipStream);
        for (const file of filesProcess.value()) {
          // const pdfBuf = await convertPDFAsync(file.docxBuf, 'pdf', undefined);

          // archive.append(pdfBuf, { name: `${file.filename}.pdf` });
          archive.append(file.docxBuf, { name: `${file.filename}.docx` });
        }
        await archive.finalize();
      }
    }

    const content = await readFileAsync(zipFilePath, 'utf-8');

    return Result.Ok({
      filename: zipFileName,
      zipBuffer: content,
      path: zipFilePath,
    });
  }

  private validateInput(data: Input): Result<void> {
    if (!data.contractId)
      return Result.fail('campo contractId requerido/inválido');

    if (!data.file && !data.client)
      return Result.fail('planilha ou dados do cliente requerido');

    return Result.Ok();
  }
}
