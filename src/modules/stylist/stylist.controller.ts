import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { StylistService } from './stylist.service';
import { CreateStylistDto } from './dto/create-stylist.dto';
import { UpdateStylistDto } from './dto/update-stylist.dto';
import { Response } from 'express';

@Controller('stylist')
export class StylistController {
  constructor(private readonly stylistService: StylistService) {}

  @Post()
  create(@Body() createStylistDto: CreateStylistDto) {
    return this.stylistService.create(createStylistDto);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const stylists = await this.stylistService.findAll();

    if (!stylists) {
      throw new NotFoundException();
    }
    return res.json({ success: true, data: stylists });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stylistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStylistDto: UpdateStylistDto) {
    return this.stylistService.update(+id, updateStylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stylistService.remove(+id);
  }
}
