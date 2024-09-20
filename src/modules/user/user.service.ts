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

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  // [POST] - /auth/register - create new account
  async registerAccount(
    req: Request,
    res: Response,
    createUserDto: CreateUserDto,
  ) {
    try {
      // hash passwd before save
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      createUserDto.password = hashedPassword;

      // save account to db
      const createdUser = await this.prisma.user.create({
        data: createUserDto as any,
      });
      delete createdUser.password;
      delete createdUser.id;

      res.status(HttpStatus.CREATED).json({ success: true, data: createdUser });
    } catch (error) {
      const message = [];
      if (error.code === 11000) {
        if (error.keyValue.email) {
          message.push('Email đã được sử dụng!');
        }

        if (error.keyValue.username) {
          message.push('Username đã được sử dụng!');
        }

        if (error.keyValue.phone_number) {
          message.push('Số điện thoại đã được sử dụng!');
        }
      } else {
        message.push('Unknown error!');
      }

      throw new HttpException({ message }, HttpStatus.BAD_REQUEST);
    }
  }

  async getDetailsUserById(id: string) {
    try {
      const detailsUser = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      return detailsUser;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }
}
