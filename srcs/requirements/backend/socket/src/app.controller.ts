import { Controller, Render, Get, Req, Res, Query } from '@nestjs/common';
// import { Response } from 'express'
// import { Request } from 'express'
import { AppService } from './app.service';
import { SocketGateway } from 'src/gateway/gateway';
import { IPair } from 'src/config/struct';

@Controller()
export class AppController {
  constructor(
    private readonly socketGateway: SocketGateway
    // private readonly appService: AppService
  ) {}

  // @Get('/chat')
  // // token 인증
  // // blacklist 확인
  // @Render('index')
  // Home() {
  //   console.log('enter home----------------------------------------------------');
  //   return { message: 'Hello world!' };
  // }

  // @Get('/api/chat')
  // async Chat(@Res() res: Response) {
  //   console.log('enter /api/chat');
  //   const messages = await this.appService.getMessages();
  //   console.log('this is message', messages);
  //   res.json(messages);
  // }
  
//   @Get('/profile_update?')
//   async profileUpdate(@Query('login') login: string, @Query('nick') nick: string) {
//     const payload = {login, nick};
// console.log('profileUpdate in app controller =', payload);
//     this.socketGateway.nicknameUpdate(payload);
//   }
  
  @Get('/profile_update?')
  async profileUpdate(@Query('login') login: string) {
console.log('>>> [app controller] enter profileUpdate <<');
    await this.socketGateway.broadcastProfileUpdate(login);
  }
  
  @Get('/addFriend?')
  async addFriend(@Query('owner') owner: string, @Query('friend') friend: string) {
console.log('>>> [app controller] enter addFriend <<');
    const payload = {key: owner, value: friend} as IPair;
    await this.socketGateway.notifyAddFriend(payload);
  }
  
  @Get('/addBlock?')
  async addBlock(@Query('owner') owner: string, @Query('block') block: string) {
console.log('>>> [app controller] enter addBlock <<', owner, block);
    const payload = {key: owner, value: block} as IPair;
    await this.socketGateway.notifyAddBlock(payload);
  }
  
  @Get('/removeFriend?')
  async removeFriend(@Query('owner') owner: string, @Query('friend') friend: string) {
console.log('>>> [app controller] enter addFriend <<');
    const payload = {key: owner, value: friend} as IPair;
    await this.socketGateway.notifyRemoveFriend(payload);
  }
  
  @Get('/removeBlock?')
  async removeBlock(@Query('owner') owner: string, @Query('block') block: string) {
console.log('>>> [app controller] enter addBlock <<', owner, block);
    const payload = {key: owner, value: block} as IPair;
    await this.socketGateway.notifyRemoveBlock(payload);
  }

  /* test code */
  @Get('/api/reqtest?')
  async Test(@Query('who') who: string) {
    console.log(who);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ENTER SOCKET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  }
}
