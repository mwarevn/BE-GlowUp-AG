import {
  HttpException,
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // register new account
  async registerAccount(createUserDto: CreateUserDto) {
    const existsUser = await this.getUser({
      phone_number: createUserDto.phone_number,
    });

    if (existsUser) {
      throw new Error('Số điện thoại này đã được sử dụng!');
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

  // update basic profile
  async updateProfile(where, updateData) {
    return await this.prisma.user.update({
      where,
      data: updateData,
    });
  }

  // getAll
  async getAll(where) {
    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        gender: true,
        role: true,
        full_name: true,
        phone_number: true,
        avatar: true,
        date_of_birth: true,
        address: true,
        profile: true,
      },
    });
  }
}
