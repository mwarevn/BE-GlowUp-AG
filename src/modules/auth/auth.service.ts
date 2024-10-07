import { Injectable } from '@nestjs/common';
import { LoginDto } from 'src/modules/user/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';

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

  // async logout(id: string) {
  //   return await PrismaDB.user.update({
  //     where: { id },
  //     data: {
  //       access_token: null,
  //       refresh_token: null,
  //     },
  //   });
  // }

  // async storeToken(where: any, access_token: string, refresh_token: string) {
  //   return await PrismaDB.user.update({
  //     where,
  //     data: {
  //       access_token,
  //       refresh_token,
  //     },
  //   });
  // }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async generateAccessToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '8m',
    });
  }

  async generateRefreshToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '8d',
    });
  }
}
