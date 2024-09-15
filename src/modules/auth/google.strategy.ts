import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserLoginGoogleDto } from 'src/modules/user/dto/user-login-google.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const responseData = profile._json;

      const user: UserLoginGoogleDto = {
        full_name: responseData.name,
        avatar: responseData.picture,
        email: responseData.email,
        googleId: profile.id,
        email_verified: responseData.email_verified,
      };

      done(null, user);
    } catch (error) {
      done(error, false);
      throw new UnauthorizedException(`Google OAuth Error: ${error.message}`);
    }
  }
}
