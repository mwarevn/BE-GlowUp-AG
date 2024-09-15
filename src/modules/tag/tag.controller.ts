import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { CreateTagDto } from 'src/modules/tag/dto/create-tag.dto';
import { TagService } from 'src/modules/tag/tag.service';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  //   get all tags - [GET] - /tag
  @Get('/:id')
  async getTagDetailsById(@Req() req: Request, @Res() res: Response) {
    const _id = req.params.id;

    const tagDetails = await this.tagService.getTagDetailsById(_id);

    if (!tagDetails) {
      throw new NotFoundException();
    }

    res.json({ success: true, data: tagDetails.toObject() });
  }

  //   get all tags - [GET] - /tag
  @Get()
  getAllTags(@Res() res: Response) {
    return this.tagService.getAllTags(res);
  }

  //   [POST] - /tag/create - create new tag
  @Post('create')
  @UseGuards(AuthGuard, RoleGuard)
  async createNewTag(@Res() res: Response, @Body() createTagDto: CreateTagDto) {
    const createdTag = await this.tagService.createNewTag(res, createTagDto);
    res.status(201).json({ success: true, data: createdTag });
  }

  //   [DELETE] - /tag/:id/delete - delete a tag
  @Delete('/:id/delete')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteTagById(@Req() req: Request, @Res() res: Response) {
    const _id: string = req.params.id;

    const deletedTag = await this.tagService.deleteTagById(_id);

    if (!deletedTag) {
      throw new BadRequestException('Tag này không tồn tại!');
    }

    res.json({ success: true, data: deletedTag });
  }

  // [PUT] /tag/:id/update - update a tag by Id
  @Put('/:id/update')
  @UseGuards(AuthGuard, RoleGuard)
  async updateTagById(
    @Body() updateTagDto: CreateTagDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const _id: string = req.params.id;
    const updatedTag = await this.tagService.updateTagById(_id, updateTagDto);

    if (!updatedTag) {
      throw new BadRequestException('Tag này không tồn tại!');
    }

    res.status(201).json({ success: true, data: updatedTag.toObject() });
  }
}
