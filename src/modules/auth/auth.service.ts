import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/modules/user/dto/login.dto';
import { User } from 'src/modules/user/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserLoginGoogleDto } from 'src/modules/user/dto/user-login-google.dto';
import { AccountType } from 'src/modules/user/enums/account-type.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // [POST] - /auth/login - login
  async loginSystem(loginDto: LoginDto, res: Response) {
    let exitstsUser: User;

    // find exists user by email
    // eslint-disable-next-line prettier/prettier
    loginDto.email &&
      (exitstsUser = await this.userModel.findOne({ email: loginDto.email }));

    // find exists user by username
    loginDto.username &&
      !exitstsUser &&
      (exitstsUser = await this.userModel.findOne({
        password: loginDto.username,
      }));

    if (!exitstsUser) {
      // eslint-disable-next-line prettier/prettier
      throw new HttpException(
        'Tài khoản hoặc mật khẩu không chính xác!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (exitstsUser.account_type !== AccountType.Basic) {
      throw new BadRequestException('Phương thức đăng nhập không hợp lệ!');
    }

    // eslint-disable-next-line prettier/prettier
    const isMatch = await this.verifyPassword(
      loginDto.password,
      exitstsUser.password,
    );

    if (!isMatch) {
      // eslint-disable-next-line prettier/prettier
      throw new HttpException(
        'Tài khoản hoặc mật khẩu không chính xác!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const dataResponse = exitstsUser.toObject();

    delete dataResponse.password;

    return await this.responseAuthorizedToken(res, { _id: dataResponse._id });
  }

  async loginGoogle(req: Request, res: Response) {
    const userLoginGoogleDto: UserLoginGoogleDto =
      req.user as unknown as UserLoginGoogleDto;

    const exitstsUser = await this.userModel.findOne({
      googleId: userLoginGoogleDto.googleId,
    });

    if (!exitstsUser) {
      // TOTO: create new account and save to db
      const createdUser = await new this.userModel({
        ...userLoginGoogleDto,
        account_type: AccountType.Google,
      }).save();
      console.log(
        '[login google] - create new profile to db and return token!',
      );
      return this.responseAuthorizedToken(res, { _id: createdUser._id });
    }

    console.log('[login google] - already have profile in db, return tokens.');
    return this.responseAuthorizedToken(res, { _id: exitstsUser._id });
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
      // eslint-disable-next-line prettier/prettier
      secret:
        type == 'access'
          ? process.env.JWT_ACCESS_SECRET
          : process.env.JWT_REFRESH_SECRET,
      expiresIn: type == 'access' ? '8m' : '8d',
    });
  }
}
