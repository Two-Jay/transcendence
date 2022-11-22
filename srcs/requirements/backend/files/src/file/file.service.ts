import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FileService {
  constructor(
    private readonly http: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  decode(token: string): {login: string} {
    return this.jwtService.decode(token) as {login: string};
  }

  async requestUpdate(token: string, avatar: string): Promise<boolean> {
    const url = 'http://auth:3000/auth/innerUpdateAvatarImagePath';
    const login = this.decode(token).login;
    const requestConfig: AxiosRequestConfig = {
      withCredentials: true,
      method: 'post',
      headers: { token },
      data: { login, avatar },
      url,
    };

    const result = await firstValueFrom(this.http.request(requestConfig))
      .catch( (e) => { throw new BadRequestException(e); } );
    return result.data;
  }
}
