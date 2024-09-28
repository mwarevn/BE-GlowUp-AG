import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StylistService } from './stylist.service';
import { CreateStylistDto } from './dto/create-stylist.dto';
import { UpdateStylistDto } from './dto/update-stylist.dto';
import { Request, Response } from 'express';
import { uploadSingleImageInterceptor } from 'src/common/configs/upload';
import { UploadService } from 'src/modules/upload/upload.service';

@Controller('stylist')
export class StylistController {
  constructor(private readonly stylistService: StylistService,private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(uploadSingleImageInterceptor())
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createStylistDto: CreateStylistDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const img = await this.uploadService.uploadSingleImageThirdParty(req);

      if (img?.data?.link) {
        createStylistDto = {...createStylistDto, avatar: img.data.link}
        const newStylist = await this.stylistService.create(createStylistDto);
        res.status(HttpStatus.CREATED).json({ success: true, data: newStylist });
      }

      
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }


  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const stylist = await this.stylistService.findAll();
      res.status(HttpStatus.OK).json({ success: true, data: stylist });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const stylist = await this.stylistService.findOne(id);
      res.status(HttpStatus.OK).json({ success: true, data: stylist });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStylistDto: UpdateStylistDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const stylist = await this.stylistService.update(id, updateStylistDto);
      res.status(HttpStatus.OK).json({ success: true, data: stylist });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseInterceptors(uploadSingleImageInterceptor())
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const stylist = await this.stylistService.remove(id);
      res.status(HttpStatus.OK).json({ success: true, data: stylist });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
