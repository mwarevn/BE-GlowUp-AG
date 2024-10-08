import { Module } from '@nestjs/common';
import { StylistService } from './stylist.service';
import { StylistController } from './stylist.controller';
import { UserService } from 'src/modules/user/user.service';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [StylistController],
  providers: [StylistService],
  imports: [UserModule],
})
export class StylistModule {}
