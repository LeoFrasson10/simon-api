import {
  cnpj as cnpjValidation,
  cpf as cpfValidation,
} from 'cpf-cnpj-validator';

export const isValidDocument = (
  type: 'cpf' | 'cnpj',
  value: string,
): boolean => {
  const validatorType = {
    cpf: cpfValidation,
    cnpj: cnpjValidation,
  };

  const isValid = validatorType[type].isValid(value);

  return isValid;
};

export const removeSpecialCharacters = (document: string) => {
  return (document ?? '').replace(/[^0-9]+/g, '');
};

export function formatCNPJNumber(documentNumber: string): string {
  const cleaned = documentNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);

  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
  }

  return documentNumber;
}

export function formatDocumentNumber(documentNumber: string): string {
  const cleaned = documentNumber.replace(/\D/g, '');
  const match =
    cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/) ||
    cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);

  if (match) {
    if (match[5]) {
      return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
    } else {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
  }

  return documentNumber;
}
