import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from 'src/modules/tag/schemas/tag.schema';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [TagController],
  providers: [TagService],
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    AuthModule,
    UserModule,
  ],
})
export class TagModule {}
