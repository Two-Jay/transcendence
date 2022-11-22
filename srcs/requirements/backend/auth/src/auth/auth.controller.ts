import { BadRequestException, Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AvatarDataDto } from 'src/dto/avatar.data.dto';
import { UserOAuthDto } from 'src/dto/user.oauth.dto';

import { Response, Request } from 'express';
import { AuthService, TokenData } from 'src/auth/auth.service';

@ApiTags('Transcendence API Collection')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('ft'))
  @Get('/login/ft')
  login() {}

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  @Get('/login/google')
  loginGoogle() {}

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('ft'))
  @Get('/login/callback')
  async loginCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const newOAuthDto = req.user as UserOAuthDto;
    const data = await this.authService.assignUser(newOAuthDto);
    // const login = this.authService.verify(req.cookies['token']).login;
    const profile = (data.profile === true);
    
    return res
      .cookie('token', data.token, data.options)
      .cookie('tfa', data.tfaEnable)
      .cookie('profile', profile)
      .redirect(await this.authService.buildAuthorizedRedirection(newOAuthDto.login, data));
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'google login-callback API (Not Working in Swagger)', description: 'oauth 콜백' })
  @UseGuards(AuthGuard('google'))
  @Get('/login/callback/google')
  async loginCallbackGoogle(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const newOAuthDto = req.user as UserOAuthDto;
    const data = await this.authService.assignUser(newOAuthDto);
    const profile = (data.profile === true);
    // const login = this.authService.verify(req.cookies['token']).login;

    return res
      .cookie('token', data.token, data.options)
      .cookie('tfa', data.tfaEnable)
      .cookie('profile', profile)
      .redirect(await this.authService.buildAuthorizedRedirection(newOAuthDto.login, data));
  }

  /**
   * [header param] code=<code: number>
   * @param req
   * @param res
   */
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: '42 TFA API (Not Working in Swagger)', description: '전달된 TFA 값 처리' })
  // @ApiCreatedResponse({ description: '전달된 TFA값에 따라 성공 실패 반환', type: 'response.send' })
  @ApiBody({
    required: true,
    schema: {
      properties: { 
        code: { type: "number" }
      }
    },
  })
  @UseGuards(AuthGuard('token'))
  @Post('/tfa')
  async tfa(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const code = Number(req.body.code);
    // const code = Number(req.cookies['code']);
console.log('code', code, req.body.code);
    const login = this.authService.verify(req.cookies['token']).login;
    const data = await this.authService.tfaConfirm(login, code);
    return res
      .cookie('token', data.token, data.options) //<< make here to validate
      .cookie('tfa', false)
      .send({ result: true });
  }

  @ApiOperation({ summary: '로그아웃 API', description: '소켓 연결 끊고 쿠키 삭제' })
  // @ApiCreatedResponse({ description: '로그아웃 성공하면, 소켓 연결 끊고 쿠키 삭제 요청 보냄', type: 'response.cookie.send' })
  @UseGuards(AuthGuard('token'))
  @Get('/logout')
  async logout(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    // const token = req.cookies['token'];
    const tokenData = this.authService.verify(req.cookies['token']);
    // if (!tokenData.validate) throw new BadRequestException();

    // await this.authService.logout(login);
    return res
      .cookie('token', '', this.authService.buildCookieOption(0))
      .cookie('tfa', '', this.authService.buildCookieOption(0))
      .cookie('profile', '', this.authService.buildCookieOption(0))
      .send({ result: true });
  }

  // @ApiOperation({ summary: '회원 탈퇴 API', description: '회원 정보를 DB에서 삭제하고 logout 절차 진행' })
  // // @ApiCreatedResponse({ description: '회원정보 삭제 & 로그아웃 & 소켓 연결 끊음 & 쿠키삭제 요청 보냄', type: 'response.cookie.send' })
  // @UseGuards(AuthGuard('token'))
  // @Get('/withdraw')
  // async withdraw(
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ): Promise<Response> {
  //   const login = this.authService.verify(req.cookies['token']).login;
  //   await this.authService.withdraw(login);
  //   return res
  //     .cookie('token', '', this.authService.buildCookieOption(0))
  //     .send({result: true});
  // }

  @ApiOperation({ summary: '이름 확인 API(빠름: just decode)', description: 'login id 반환(빠름)' })
  @UseGuards(AuthGuard('token'))
  @Get('/whoami')
  async whoami(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const tokenData: TokenData = this.authService.verify(req.cookies['token']);
console.log('whoami', tokenData);
    return res.send({whoami: tokenData.login, validate: tokenData.validate});
  }

  @ApiOperation({ summary: '본인 세부정보 API(느림: DB access)', description: 'DB에서 값 읽어서, whoami보다 많은 정보 보냄(느림)' })
  // @ApiCreatedResponse({ description: 'token없이 보내면, 인증 에러 발생', type: 'response.send' })
  @UseGuards(AuthGuard('token'))
  @Get('/whoamiDetail')
  async whoamiDetail(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const tokenData = this.authService.verify(req.cookies['token']);
    if (!tokenData.validate) throw new BadRequestException();

console.log('token', req.cookies['token']);
console.log('whoamiDetail', tokenData.login);
    const data = await this.authService.whoamiDetail(tokenData.login);
console.log('==========================================> ', {whoamiDetail: data});
    return res.send({whoamiDetail: data});
  }




  @ApiOperation({ summary: 'Who Are You API (느림: DB access)', description: 'post로 login_name 전달 필요' })
  @ApiBody({
    required: true,
    schema: {
      properties: { data: { type: "string" } }
    },
  })
  @UseGuards(AuthGuard('token'))
  @Post('/whoAreYou')
  async whoamAreYou(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
console.log('enter whoAreYou', req.cookies['token']);
    const tokenData = this.authService.verify(req.cookies['token']);
console.log('tokenData', tokenData);
    if (!tokenData.validate) throw new BadRequestException();

console.log('req.body', req.body);
    const who: string = req.body['data'] as string;
console.log('who', who);
    if (!who) throw new BadRequestException();

console.log('token', req.cookies['token']);
console.log('who', who);
    const data = await this.authService.whoamiDetail(who);
console.log('==========================================> ', {whoAreYou: data});
    return res.send({login: data.login, nickname: data.nickname, avatar: data.avatar});
  }

//
  @ApiOperation({ summary: 'TFA enable API', description: 'post로 true/false 필요' })
  @ApiBody({
    required: true,
    schema: {
      properties: { data: { type: "boolean" } }
    },
  })
  @UseGuards(AuthGuard('token'))
  @Post('/tfaEnable')
  async updateTfaUsage(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    // const login = this.authService.verify(req.cookies['token']).login;
    const tokenData = this.authService.verify(req.cookies['token']);
    if (!tokenData.validate) throw new BadRequestException();

    await this.authService.updateTfaUsage(tokenData.login, req.body.data);
    return res.send({tfaEnable: req.body.data});
  }
  
  @ApiOperation({ summary: 'Updata nickname API', description: 'post로 nickname 전달 필요' })
  @ApiBody({
    required: true,
    schema: {
      properties: { data: { type: "string" } }
    },
  })
  @UseGuards(AuthGuard('token'))
  @Post('/updateNickname')
  async updateNickname(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const tokenData = this.authService.verify(req.cookies['token']);
    if (!tokenData.validate) throw new BadRequestException();

    // const login = this.authService.verify(req.cookies['token']).login;
    await this.authService.updateNickname(tokenData.login, req.body.data);
    return res
      .cookie('profile', false)
      .send({ result: true });
  }

  @ApiExcludeEndpoint()
  @Post('/innerUpdateAvatarImagePath')
  async innerUpdateAvatarImagePath(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: AvatarDataDto,
  ): Promise<Response> {
    const token: string = req.headers['token'] as string;
    const tokenData = this.authService.verify(token);
    if (!tokenData.validate) throw new BadRequestException();

    await this.authService.updateAvatarImage(tokenData.login, body);
    return res.send({result: true});
  }

  @ApiOperation({ summary: 'Add friend API', description: 'post로 login 전달 필요' })
  @ApiBody({
    required: true,
    schema: {
      properties: { 
        friend_login: { type: "string" },
        add: { type: "boolean" }
      }
    },
  })
  @UseGuards(AuthGuard('token'))
  @Post('/friend')
  async friendHandle(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const tokenData = this.authService.verify(req.cookies['token']);
    if (!tokenData.validate) throw new BadRequestException();

    // const owner: string = this.authService.verify(req.cookies['token']).login;
    const friend: string = req.body.friend_login;
    const isAdd: boolean = req.body.add;
    // if (owner === friend) throw new BadRequestException();

    if (isAdd)
      await this.authService.addFriend(tokenData.login, friend);
    else
      await this.authService.removeFriend(tokenData.login, friend);
    
    return res.send({ result: true });
  }

  @ApiOperation({ summary: 'Add block API', description: 'post로 login 전달 필요' })
  @ApiBody({
    required: true,
    schema: {
      properties: { 
        block_login: { type: "string" },
        add: { type: "boolean" }
      }
    },
  })
  @UseGuards(AuthGuard('token'))
  @Post('/block')
  async blockHandle(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const tokenData = this.authService.verify(req.cookies['token']);
    if (!tokenData.validate) throw new BadRequestException();

    // const owner: string = this.authService.verify(req.cookies['token']).login;
    const block: string = req.body.block_login;
    const isAdd: boolean = req.body.add;
    // if (owner === block) throw new BadRequestException();

    if (isAdd)
      await this.authService.addBlock(tokenData.login, block);
    else
      await this.authService.removeBlock(tokenData.login, block);

    return res.send({ result: true });
  }

  @ApiOperation({ summary: 'check friend API', description: 'post로 login 전달 필요' })
  @ApiBody({
    required: true,
    schema: {
      properties: { data: { type: "string" } }
    },
  })
  @UseGuards(AuthGuard('token'))
  @Post('/whoisfriend')
  async isFriend(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const tokenData = this.authService.verify(req.cookies['token']);
    if (!tokenData.validate) throw new BadRequestException();

    // const login = this.authService.verify(req.cookies['token']).login;
    return res.send({ result: (await this.authService.isFriend(tokenData.login, req.body.data)) });
  }

  @ApiOperation({ summary: 'check block API', description: 'post로 login 전달 필요' })
  @ApiBody({
    required: true,
    schema: {
      properties: { data: { type: "string" } }
    },
  })
  @UseGuards(AuthGuard('token'))
  @Post('/whoisblock')
  async isBlock(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const tokenData = this.authService.verify(req.cookies['token']);
    if (!tokenData.validate) throw new BadRequestException();

    // const login = this.authService.verify(req.cookies['token']).login;
    return res.send({ result: (await this.authService.isBlock(tokenData.login, req.body.data)) });
  }





  // /* test code */
  // @ApiOperation({ summary: 'TEST: 특정유저의 DB데이터 보여주는 API', description: '로그인 여부 관계없이 보여줌' })
  // // @ApiCreatedResponse({ description: '로그인 여부 관계없이 전체 유저 보여줌', type: 'body' })
  // @Get('/showuser?')
  // async showuser(@Query('name') name: string): Promise<any> {
  //   const who = await this.authService.findWhoInUser(name);
  //   console.log('show', who);
  //   return {userList: who};
  // }

  // /* test code */
  // @ApiOperation({ summary: 'TEST: 특정유저의 로그인 상태 정보 반환', description: 'http://localhost:3000/auth/showsession?name=<NAME>' })
  // // @ApiCreatedResponse({ description: '특정유저의 로그인 상태 정보 반환', type: 'body' })
  // @Get('/showsession?')
  // async showsession(@Query('name') name: string): Promise<any> {
  //   // const who = await this.authService.findWhoInSession(name);
  //   const who = await this.authService.whoIsOnline(name);
  //   return {login: who};
  // }

  // /* test code */
  // @ApiOperation({ summary: 'TEST: 특정유저정보를 DB에서 삭제', description: 'http://localhost:3000/auth/testdelete?name=<NAME>' })
  // // @ApiCreatedResponse({ description: 'DB에서 삭제하고 쿠키도 삭제', type: 'body' })
  // @Get('/testdelete?')
  // async testDelete(
  //   @Query('name') name: string,
  //   @Res() res: Response,
  // ): Promise<Response> {
  //   const result = await this.authService.delete(name);
  //   res.cookie('token', '', this.authService.buildCookieOption(0));
  //   res.send(result);
  //   return res;
  // }
}
