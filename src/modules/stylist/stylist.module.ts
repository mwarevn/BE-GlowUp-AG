import { Module } from '@nestjs/common';
import { StylistService } from './stylist.service';
import { StylistController } from './stylist.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Module({
  controllers: [StylistController],
  providers: [StylistService, PrismaService],
})
export class StylistModule { }
