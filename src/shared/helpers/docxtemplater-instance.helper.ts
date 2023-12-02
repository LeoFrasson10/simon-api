import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

export const createDocxtemplaterInstance = (
  buffer: Buffer,
): Docxtemplater<PizZip> => {
  const zip = new PizZip(buffer);
  return new Docxtemplater(zip);
};
