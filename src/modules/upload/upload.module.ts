import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
// import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { createHash } from 'crypto';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [
    UserModule,
    // MulterModule.register({
    //   storage: diskStorage({
    //     filename: function (req, file, cb) {
    //       const hash = createHash('sha256');
    //       hash.update(file.originalname + Date.now().toString());
    //       const randomFilename = hash.digest('hex').slice(0, 10);
    //       cb(null, randomFilename + '_' + file.originalname);
    //     },
    //     destination: `${__dirname.split('upload')[0]}/public/img`,
    //   }),
    //   fileFilter: (req, file, callback) => {
    //     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    //       return callback(new Error('Only image files are allowed!'), false);
    //     }
    //     callback(null, true);
    //   },
    // }),
    AuthModule,
  ],
})
export class UploadModule {}
