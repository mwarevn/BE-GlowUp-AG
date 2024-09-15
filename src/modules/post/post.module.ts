import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/modules/post/schemas/post.schema';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { TagModule } from 'src/modules/tag/tag.module';
import { UploadModule } from 'src/modules/upload/upload.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UserModule,
    AuthModule,
    CategoryModule,
    TagModule,
    // UploadModule,
  ],
})
export class PostModule {}
