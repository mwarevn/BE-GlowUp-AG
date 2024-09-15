import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    let access_token = this.extractAccessTokenFromHeader(request);
    const refresh_token = this.extractRefreshTokenFromHeader(request);

    if (!access_token) {
      throw new UnauthorizedException('Access token is missing');
    }

    try {
      // verify access token
      const payload = await this.jwtService.verifyAsync(access_token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      const detailsUser = await this.getDetailsUserByIdFromPayload(payload._id);

      if (!detailsUser) {
        throw new UnauthorizedException();
      }

      delete detailsUser.password;

      // Set payload vào request
      request['user'] = detailsUser;
    } catch (err) {
      // Nếu access token hết hạn, thử refresh
      if (err.name === 'TokenExpiredError' && refresh_token) {
        try {
          const refreshPayload = await this.jwtService.verifyAsync(
            refresh_token,
            {
              secret: process.env.JWT_REFRESH_SECRET,
            },
          );

          delete refreshPayload.exp;
          delete refreshPayload.iat;

          access_token = await this.authService.generateToken({
            _id: refreshPayload._id,
          });

          const detailsUser = await this.getDetailsUserByIdFromPayload(
            refreshPayload._id,
          );

          console.log('generated new access token!');
          response.cookie('access_token', access_token, {
            httpOnly: true,
            secure: false,
          });

          request['user'] = detailsUser;
        } catch (error) {
          throw new UnauthorizedException(
            'Refresh token is invalid or expired',
          );
        }
      } else {
        throw new UnauthorizedException('Invalid access token!');
      }
    }

    return true;
  }

  private extractAccessTokenFromHeader(request: Request): string | undefined {
    return request.cookies.access_token || undefined;
  }

  private extractRefreshTokenFromHeader(request: Request): string | undefined {
    return request.cookies.refresh_token || undefined;
  }

  private async getDetailsUserByIdFromPayload(_id: string) {
    return await this.userService.getDetailsUserById(_id);
  }
}
