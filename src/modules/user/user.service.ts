import {
  HttpException,
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/modules/user/schemas/user.schema';
import * as bcrypt from 'bcrypt';
// import { LoginDto } from 'src/modules/user/dto/login.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
      const createdUser = await new this.userModel(createUserDto).save();
      const responseData = createdUser.toObject();
      delete responseData.password;
      delete responseData._id;

      res
        .status(HttpStatus.CREATED)
        .json({ success: true, data: responseData });
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

  async getDetailsUserById(_id: string) {
    try {
      const detailsUser = await this.userModel.findById(_id);
      return detailsUser;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }
}
