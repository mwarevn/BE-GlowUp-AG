import {
  CanActivate,
  ExecutionContext,
  // HttpException,
  // HttpStatus,
  Injectable,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AccountRole } from 'src/modules/user/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return request['user']['role'] === AccountRole.Admin;
  }
}
