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
import { AdminGuard } from 'src/common/guards/roles.guard';
import { uploadSingleImageInterceptor } from 'src/common/configs/upload';

@Controller('upload')
@UseGuards(AuthGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}
  @Post('picture')
  @UseGuards(AdminGuard)
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
