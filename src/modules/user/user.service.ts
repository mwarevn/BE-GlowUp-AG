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

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // register new account
  async registerAccount(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;

    const createdUser = await this.createUser({
      data: createUserDto as any,
    });

    return new UserEntity(createdUser);
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
