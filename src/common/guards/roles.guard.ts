import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AccountRole } from 'src/modules/user/enums/role.enum';

const compareRole = (req: Request, role: AccountRole): boolean => {
  return req['user']['role'] === role;
};

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return compareRole(request, AccountRole.Admin);
  }
}

@Injectable()
export class CustomerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return compareRole(request, AccountRole.Customer);
  }
}
