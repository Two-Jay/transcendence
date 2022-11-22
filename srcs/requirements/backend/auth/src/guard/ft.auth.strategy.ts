import {
  UnauthorizedException,
  Injectable,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { UserOAuthDto } from 'src/dto/user.oauth.dto';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize?client_id=${configService.get<string>(
        'ft.client_id',
      )}&redirect_uri=${configService.get<string>(
        'ft.callback',
      )}&response_type=code`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: configService.get<string>('ft.client_id'),
      clientSecret: configService.get<string>('ft.client_secret'),
      callbackURL:
        configService.get<string>('ft.callback') + '/auth/login/callback',
    });
  }

  @UsePipes(ValidationPipe)
  async validate(
    accessToken: string,
    refreshToken: string,
  ): Promise<UserOAuthDto> {
    const me = 'https://api.intra.42.fr/v2/me';
    const source = await this.http.axiosRef
      .get(me, { headers: { Authorization: `Bearer ${accessToken}` } })
      .catch((e) => {
        throw new UnauthorizedException(e);
      });
    return {
      login: source.data.login,
      accessToken,
      refreshToken,
    } as UserOAuthDto;
  }
}
