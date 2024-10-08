import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ComboService } from './combo.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { UploadService } from '../upload/upload.service';
import { uploadSingleImageInterceptor } from 'src/common/configs/upload';
import { Request, Response } from 'express';
@UseInterceptors(uploadSingleImageInterceptor())
@Controller('combo')
export class ComboController {
  constructor(
    private readonly comboService: ComboService,
    private uploadService: UploadService,
  ) {}

  @Post()
  async create(
    @Body() createComboDto: CreateComboDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const imgData = await this.uploadService.uploadSingleImageThirdParty(req);
      createComboDto.picture = imgData.data.link;
      const combo = await this.comboService.create(createComboDto);
      res.json(combo);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          `The combo name must be unique. The value you provided already exists.`,
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Internal server error' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    const combo = await this.comboService.findAll();
    return combo;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comboService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateComboDto: UpdateComboDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const imgData = await this.uploadService.uploadSingleImageThirdParty(req);
      updateComboDto.picture = imgData.data.link;
      const combo = await this.comboService.update(id, updateComboDto);
      res.json(combo);
    } catch (error) {
      throw new HttpException(
        'Internal server error' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comboService.remove(id);
  }
}
