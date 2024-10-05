import {
  HttpException,
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserEntity } from 'src/modules/user/entitys/user.entity';
import { ValidationError } from 'class-validator';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // register new account
  async registerAccount(createUserDto: CreateUserDto) {
    const existsUser = await this.getUser({
      phone_number: createUserDto.phone_number,
    });

    if (existsUser) {
      return { error: 'Số điện thoại đã được sử dụng!' };
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const createdUser = await this.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser;
  }

  // get unique user by codition
  async getUser(where: any) {
    return await this.prisma.user.findUnique({ where });
  }

  // create user with input data
  async createUser(data: any) {
    return await this.prisma.user.create({ data });
  }
}
