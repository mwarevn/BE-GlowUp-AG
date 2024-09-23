import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/roles.guard';
import { PrismaDB } from 'src/modules/prisma/prisma.extensions';

@Controller('user')
export class UserController {
  constructor() {}

  @Get('delete')
  @UseGuards(AuthGuard, AdminGuard)
  async deleteUser(@Res() res: Response) {
    console.log(
      await PrismaDB.user.delete({
        where: { id: '66eff159557a6976231f5151' },
      }),
    );

    res.json({ ok: true });
  }
}
