import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  ServiceUnavailableException,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Prisma, User } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { PrismaDB } from 'src/modules/prisma/prisma.extensions';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { LoginDto } from 'src/modules/user/dto/login.dto';
import { UserResponeEntity } from 'src/modules/user/response-entitys/user.entity';
import { UserService } from 'src/modules/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async registerAccount(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const createdAccount =
        await this.userService.registerAccount(createUserDto);

      if (!createdAccount) {
        throw new BadRequestException('Số điện thoại này đã được sử dụng!');
      }

      res.json({ success: true, data: createdAccount });
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  async loginSystem(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const validUser = await this.authService.loginSystem(loginDto, res);
      if (!validUser) {
        throw new UnauthorizedException();
      }

      // remove protected fields
      delete validUser.password;
      delete validUser.deleted;

      res.json(validUser);
    } catch (error) {
      throw new ServiceUnavailableException(
        'Số điện thoại hoặc mật khẩu không chính xác!',
      );
    }
  }

  @Get('logout')
  async logout(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const result = await this.authService.logout(id);

    if (!result) {
      throw new BadRequestException('Can not logout now !');
    }

    res.json({ success: true });
  }

  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth() {}

  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
  //   return this.authService.loginGoogle(req, res);
  // }
}
