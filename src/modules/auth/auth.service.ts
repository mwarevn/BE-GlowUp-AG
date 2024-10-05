import {
  BadRequestException,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from 'src/modules/user/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { PrismaDB } from 'src/modules/prisma/prisma.extensions';
import { UserResponeEntity } from 'src/modules/user/response-entitys/user.entity';

export interface JWTPayload {
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async loginSystem(loginDto: LoginDto, res: Response) {
    const matchedUser = await this.userService.getUser({
      phone_number: loginDto.phone_number,
    });

    // if phone number not found
    if (!matchedUser) {
      return null;
    }

    const isMatch = await this.verifyPassword(
      loginDto.password,
      matchedUser.password,
    );

    // if password does not match
    if (!isMatch) {
      return null;
    }

    return matchedUser;
  }

  async logout(id: string) {
    return await PrismaDB.user.update({
      where: { id },
      data: {
        access_token: null,
        refresh_token: null,
      },
    });
  }

  async responseAuthorizedToken(res: Response, payload: JWTPayload) {
    const access_token = await this.generateToken(payload),
      refresh_token = await this.generateToken(payload, 'refresh');

    this.storeToken({ id: payload.id }, access_token, refresh_token);

    res.cookie('access_token', access_token, { httpOnly: true, secure: false });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
    });

    const data = {
      access_token,
      refresh_token,
      user: payload,
    };

    return res.status(200).json({ success: true, data });
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async storeToken(where: any, access_token: string, refresh_token: string) {
    return await PrismaDB.user.update({
      where,
      data: {
        access_token,
        refresh_token,
      },
    });
  }

  async generateToken(payload, type = 'access') {
    return await this.jwtService.signAsync(payload, {
      secret:
        type == 'access'
          ? process.env.JWT_ACCESS_SECRET
          : process.env.JWT_REFRESH_SECRET,
      expiresIn: type == 'access' ? '8m' : '8d',
    });
  }
}
