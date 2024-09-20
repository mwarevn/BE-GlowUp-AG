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
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async loginSystem(loginDto: LoginDto, res: Response) {
    let exitstsUser: User;

    // find exists user by email
    loginDto.email &&
      (exitstsUser = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
      }));

    // find exists user by username
    loginDto.username &&
      !exitstsUser &&
      (exitstsUser = await this.prisma.user.findUnique({
        where: {
          username: loginDto.username,
        },
      }));

    if (!exitstsUser) {
      throw new HttpException(
        'Tài khoản hoặc mật khẩu không chính xác!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (exitstsUser.account_type !== 'Basic') {
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
    const userLoginGoogleDto: UserLoginGoogleDto =
      req.user as unknown as UserLoginGoogleDto;

    const exitstsUser = await this.prisma.user.findUnique({
      where: {
        googleId: userLoginGoogleDto.googleId,
      },
    });

    if (!exitstsUser) {
      const createdUser = await this.prisma.user.create({
        data: {
          ...(userLoginGoogleDto as any),
          account_type: 'Google',
        },
      });
      console.log(
        '[login google] - create new profile to db and return token!',
      );
      return this.responseAuthorizedToken(res, { id: createdUser.id });
    }

    console.log('[login google] - already have profile in db, return tokens.');
    return this.responseAuthorizedToken(res, { id: exitstsUser.id });
  }

  async responseAuthorizedToken(res: Response, payload) {
    const access_token = await this.generateToken(payload),
      refresh_token = await this.generateToken(payload, 'refresh');

    res.cookie('access_token', access_token, { httpOnly: true, secure: false });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
    });

    const data = {
      tokens: {
        access_token,
        refresh_token,
      },
      user: payload,
    };

    return res.status(200).json({ success: true, data });
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
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
