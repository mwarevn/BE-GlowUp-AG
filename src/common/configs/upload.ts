import * as multer from 'multer';
import { createHash } from 'crypto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

const storageOptions = multer.diskStorage({
  filename: (req, file, cb) => {
    const hash = createHash('sha256')
      .update(file.originalname + Date.now().toString())
      .digest('hex')
      .slice(0, 10);
    cb(null, `${hash}_${file.originalname}`);
  },
  destination: `${__dirname.split('modules')[0]}public/img`,
});

const fileFilter = (req, file, callback) => {
  const isMatch = file.originalname.match(/\.(jpg|jpeg|png)$/);

  if (!isMatch) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const uploadSingleImageInterceptor = () =>
  FileInterceptor('picture', {
    storage: storageOptions,
    fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
  });
