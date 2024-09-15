import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { ICategoryRespone } from 'src/modules/category/types/category.type';
import { Visibility } from 'src/modules/post/enums/visibility.enum';
import { ITagRespone } from 'src/modules/tag/types/tag.type';
import { IUserResponse } from 'src/modules/user/types/user.type';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  cover_image: string;

  @Prop({ required: true })
  keywords: string[];

  @Prop({ required: true })
  description: string;

  @Prop({ required: true }) // mark down (stringtify) or redered HTML
  content: string;

  @Prop({ required: true })
  tags: Pick<ITagRespone, '_id'>[];

  @Prop({ required: true })
  categories: Pick<ICategoryRespone, '_id'>[];

  @Prop({ required: true })
  author: string;

  @Prop({ required: true, enum: Visibility })
  visibility: Visibility;
}

export const PostSchema = SchemaFactory.createForClass(Post);
