import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/modules/user/user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
}
