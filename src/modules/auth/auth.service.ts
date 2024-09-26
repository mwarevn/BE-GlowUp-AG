import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { LoginDto } from 'src/modules/user/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserLoginGoogleDto } from 'src/modules/user/dto/user-login-google.dto';
import { AccountType, User } from '@prisma/client';
import { UserService } from 'src/modules/user/user.service';
import { PrismaDB } from 'src/modules/prisma/prisma.extensions';

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
    let exitstsUser: User;

    loginDto.email &&
      (exitstsUser = await this.userService.getUser({
        email: loginDto.email,
      }));

    loginDto.username &&
      !exitstsUser &&
      (exitstsUser = await this.userService.getUser({
        username: loginDto.username,
      }));

    if (!exitstsUser) {
      throw new HttpException(
        'Tài khoản hoặc mật khẩu không chính xác!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (exitstsUser.account_type !== 'BASIC') {
      throw new BadRequestException('Phương thức đăng nhập không hợp lệ!');
    }

    const isMatch = await this.verifyPassword(
      loginDto.password,
      exitstsUser.password,
    );

    if (!isMatch) {
      throw new HttpException(
        'Tài khoản hoặc mật khẩu không chính xác!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete exitstsUser.password;

    return await this.responseAuthorizedToken(res, { id: exitstsUser.id });
  }

  async loginGoogle(req: Request, res: Response) {
    const userLoginGoogleDto = req.user as unknown as UserLoginGoogleDto;

    const exitstsUser = await this.userService.getUser({
      googleId: userLoginGoogleDto.googleId,
    });

    if (!exitstsUser) {
      const createdUser = await this.userService.createUser({
        ...(userLoginGoogleDto as any),
        account_type: AccountType.GOOGLE,
      });

      return this.responseAuthorizedToken(res, { id: createdUser.id });
    }
    return this.responseAuthorizedToken(res, { id: exitstsUser.id });
  }

  async logout() {}

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
