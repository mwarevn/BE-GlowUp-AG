import {
  //   BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { CreateTagDto } from 'src/modules/tag/dto/create-tag.dto';
import { Tag, TagDocument } from 'src/modules/tag/schemas/tag.schema';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private TagModel: Model<TagDocument>) {}

  //   [GET]
  async getTagDetailsById(_id: string) {
    try {
      const tagDetails = await this.TagModel.findById(_id);
      return tagDetails;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  // [GET] /tag - get all tags
  async getAllTags(res: Response) {
    const tags = await this.TagModel.find();

    res.json({ success: true, data: tags });
    try {
    } catch (error) {
      throw new HttpException(
        'Service unavalaible!',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // [POST] /tag/create - create new tag
  async createNewTag(res: Response, createTagDto: CreateTagDto) {
    try {
      const createdTag = (
        await new this.TagModel(createTagDto).save()
      ).toObject();

      return createdTag;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('Tag này đã tồn tại!', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Không thể tạo tag!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //   [DELETE]
  async deleteTagById(_id: string) {
    try {
      const deletedTag = await this.TagModel.findByIdAndDelete(_id);
      return deletedTag;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  //   [PUT]
  async updateTagById(_id: string, updateTagDto: CreateTagDto) {
    try {
      const updatedTag = await this.TagModel.findByIdAndUpdate(
        _id,
        updateTagDto,
        { new: true },
      );
      return updatedTag;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }
}
