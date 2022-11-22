import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserOAuthDto } from 'src/dto/user.oauth.dto';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    // private readonly usersService: UsersService,
  ) {
    super({
      // Put config in `.env`
      clientID: '477829362113-f0gggc2q9j4g0rrs8lvbbusr9g0973ta.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/login/callback/google',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const email = profile.emails[0].value;
    // Here a custom User object is returned. In the the repo I'm using a UsersService with repository pattern, learn more here: https://docs.nestjs.com/techniques/database
    return {
      login: email,
      accessToken,
      refreshToken: 'hello world',
    } as UserOAuthDto;
  }
}
