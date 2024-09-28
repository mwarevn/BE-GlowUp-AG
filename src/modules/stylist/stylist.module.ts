import { Module } from '@nestjs/common';
import { StylistService } from './stylist.service';
import { StylistController } from './stylist.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UploadModule } from 'src/modules/upload/upload.module';

@Module({
  controllers: [StylistController],
  providers: [StylistService, PrismaService],
  imports: [UploadModule]
})
export class StylistModule { }
