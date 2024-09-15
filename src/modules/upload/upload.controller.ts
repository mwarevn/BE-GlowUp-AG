import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { createHash } from 'crypto';
import { Request, Response } from 'express';
import { UploadService } from 'src/modules/upload/upload.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';

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

const uploadSingleImageInterceptor = () =>
  FileInterceptor('picture', {
    storage: storageOptions,
    fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
  });

@Controller('upload')
@UseGuards(AuthGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}
  @Post('picture')
  @UseGuards(RoleGuard)
  @UseInterceptors(uploadSingleImageInterceptor())
  uploadPicture(@UploadedFile() file: Express.Multer.File) {
    const fileLink = file.filename;
    return fileLink;
  }

  @Post('third-party/picture')
  @UseInterceptors(uploadSingleImageInterceptor())
  async uploadThirdPartyPicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.uploadService.uploadSingleImageThirdParty(req, res);
  }
}
