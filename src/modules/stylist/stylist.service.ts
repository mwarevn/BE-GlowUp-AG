import { BadRequestException, HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStylistDto } from './dto/create-stylist.dto';
import { UpdateStylistDto } from './dto/update-stylist.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import mongoose from 'mongoose';


@Injectable()
export class StylistService {
  constructor(private prisma: PrismaService) { }

  private async isValueDuplicate(field: string, value: any): Promise<boolean> {
    const result = await this.prisma.stylist.findFirst({
      where: { [field]: value },
    });
    return !!result;// trả về true nếu result có giá trị
  }

  async create(
    createStylistDto: CreateStylistDto) {
    const [emailExists, fullNameExists, phoneNumberExists] = await Promise.all([
      this.isValueDuplicate('email', createStylistDto.email),
      this.isValueDuplicate('full_name', createStylistDto.full_name),
      this.isValueDuplicate('phone_number', createStylistDto.phone_number)
    ]);
    try {
      if (emailExists) {
        throw new BadRequestException('Email đã tồn tại');
      }

      if (fullNameExists) {
        throw new BadRequestException('Tên đã tồn tại');
      }

      if (phoneNumberExists) {
        throw new BadRequestException('Số điện thoại đã tồn tại');
      }
      const newStylist = await this.prisma.stylist.create({ data: createStylistDto });
      return newStylist;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async findAll() {
    const stylist = await this.prisma.stylist.findMany()
    return stylist
  }
  async findOne(id: string) {
    try {

      if (await this.isValueDuplicate('id', id) === false) {
        throw new BadRequestException('id không tồn tại trong database');
      }

      const stylist = await this.prisma.stylist.findUnique({
        where: {
          id: id
        },
      })
      return stylist
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateStylistDto: UpdateStylistDto) {
    try {

      if (await this.isValueDuplicate('id', id) === false) {
        throw new BadRequestException('id không tồn tại trong database');
      }

      const stylist = await this.prisma.stylist.update({
        where: {
          id: id,
        },
        data: {
          ...updateStylistDto
        },
      })
      return stylist
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    try {

      if (await this.isValueDuplicate('id', id) === false) {
        throw new BadRequestException('id không tồn tại trong database');
      }

      const stylist = await this.prisma.stylist.delete({
        where: {
          id: id
        },
      })
      return stylist
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
