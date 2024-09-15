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
// import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor() {} // private userService: UserService, // private jwtService: JwtService,

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return request['user']['role'] === AccountRole.Admin;
    // const access_token = this.extractAccessTokenFromHeader(request);

    // try {
    //   const payload = await this.jwtService.verifyAsync(access_token, {
    //     secret: process.env.JWT_ACCESS_SECRET,
    //   });

    //   const user = await this.getDetailsUserByIdFromPayload(payload._id);

    //   return user.role == AccountRole.Admin;
    // } catch (error) {
    //   throw new HttpException(
    //     "You dont't have permission to access this content!",
    //     HttpStatus.FORBIDDEN,
    //   );
    // }
  }
  // private extractAccessTokenFromHeader(request: Request): string | undefined {
  //   return request.cookies.access_token || undefined;
  // }

  // private async getDetailsUserByIdFromPayload(_id: string) {
  //   return await this.userService.getDetailsUserById(_id);
  // }
}
