import { HttpException, HttpStatus } from '@nestjs/common';

export const verifyFileType = (req, file, callback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/jpg',
    'application/pdf',
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new HttpException(
        'Tipo de arquivo não permitido',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }

  callback(null, true);
};

export const verifyFilePDFType = (req, file, callback) => {
  const allowedMimeType = 'application/pdf';

  if (allowedMimeType !== file.mimetype) {
    return callback(
      new HttpException(
        'Tipo de arquivo não permitido, permitido apenas PDF.',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }

  callback(null, true);
};
