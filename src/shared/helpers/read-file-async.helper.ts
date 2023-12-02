import util from 'util';
import * as fs from 'fs';
import * as libre from 'libreoffice-convert';

export const readFileAsync = util.promisify(fs.readFile);

export const convertPDFAsync = util.promisify(libre.convert);
