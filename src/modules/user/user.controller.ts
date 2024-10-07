import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '@prisma/client';
import { Request, Response } from 'express';
import { uploadSingleImageInterceptor } from 'src/common/configs/upload';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/roles.guard';
import { PrismaDB } from 'src/modules/prisma/prisma.extensions';
import { UploadService } from 'src/modules/upload/upload.service';
import { UpdateProfileUserDTO } from 'src/modules/user/dto/user.update.dto';
import { UserService } from 'src/modules/user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async deleteUser(@Res() res: Response) {
    console.log(
      await PrismaDB.user.delete({
        where: { id: '66eff159557a6976231f5151' },
      }),
    );

    res.json({ success: true });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Body() updateProfileDTO: UpdateProfileUserDTO,
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const user = req['user'];
    // TODO: thêm phần quyền cập nhật - user chỉnh profile - stylist chỉnh profile và profile users
    const accepted = user['id'] === id || user['role'] === Roles.ADMIN;

    if (!accepted) {
      throw new ForbiddenException(
        'Bạn không có quyền thay đổi thông tin người dùng này!',
      );
    }

    try {
      const updatedUser = await this.userService.updateProfile(
        { id },
        updateProfileDTO,
      );

      res.json({ success: true });
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException('Kiểm tra lại định dạng dữ liệu!');
    }
  }
}
