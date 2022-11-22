import { BadRequestException, Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/email/email.service';

import { AvatarDataDto } from 'src/dto/avatar.data.dto';
import { UserOAuthDto } from 'src/dto/user.oauth.dto';
import { ResDataDto } from 'src/dto/res.data.dto';

import { GameEntity } from 'src/entity/game.entity';
import { UserEntity } from 'src/entity/user.entity';

export class TokenData {
  public login: string;
  public validate: boolean;
}

export class UserData {
  public user: UserEntity;
  public validate: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly http: HttpService,
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  seed: number = Number(process.env.SEED);

  async saveUserRepository(user: UserEntity): Promise<void> {
    if (user === null || user.login === null || user === undefined) {
      throw new BadRequestException(`incorrect user`);
    }
    await this.databaseService.saveUserRepository(user);
  }

  async findWhoInUser(login: string): Promise<UserEntity> {
    const user = await this.databaseService.whoIsUser(login);
    return user;
  }

  async mustOnline(login: string): Promise<void> {
    const online = await this.databaseService.whoIsOnline(login);
    if (!online) throw new BadRequestException();
  }
  
  async whoIsOnline(login: string): Promise<boolean> {
    return await this.databaseService.whoIsOnline(login);
  }

  // async deleteUser(login: string): Promise<void> {
  //   await this.databaseService.deleteUser(login);
  // }

  async whoamiDetail(login: string): Promise<any> {
    const user: UserEntity = await this.findWhoInUser(login);
console.log('user', user);
    if (!user) throw new BadRequestException();

    const online: boolean = await this.whoIsOnline(login);
console.log('online', online);
    if (!online) throw new BadRequestException();

    return {
      login,
      nickname: user.nickname,
      avatar: user.avatar,
      contents: {
        tfaEnable: user.tfaEnable,
        online,
      }
    }
  }

  @UsePipes(ValidationPipe)
  async assignUser(userOAuthDto: UserOAuthDto): Promise<ResDataDto> {
    const login = userOAuthDto.login;
    const expire = this.configService.get('token.expire');
    // const user = await this.findWhoInUser(login) ?? this.buildUserEntity(userOAuthDto);
    const userData: {profile: boolean, user: UserData} = await this.getUserData(userOAuthDto);
    // const user = await this.findWhoInUser(login);
    // const token = this.encode({login});
    const token = this.encode({login: userData.user.user.login, validate: !userData.user.user.tfaEnable} as TokenData);
    const options = this.buildCookieOption(expire);
    
    const code = await this.saveAssignedUser(userData.user.user);
    // await this.sendTfaMail(userData.user.tfaEnable, userData.user, code);

    return {
      token,
      options,
      tfaEnable: userData.user.user.tfaEnable,
      profile: userData.profile,
    } as ResDataDto;
  }

  async getUserData(userOAuthDto: UserOAuthDto): Promise<{profile: boolean, user: UserData}> {
    const user = await this.findWhoInUser(userOAuthDto.login);

    if (!user) {
      return {profile: true, user: { user: this.buildUserEntity(userOAuthDto), validate: true }  as UserData};
    }

    const profile = user.nickname[0] === '$';
    return {profile, user: { user, validate: user.tfaEnable } as UserData};
  }

  async updateTfaUsage(login: string, tfaEnable: boolean): Promise<void> {
    const user = await this.findWhoInUser(login);
    
    await this.mustOnline(login);
    if (user.tfaEnable != tfaEnable) {
      user.tfaEnable = tfaEnable;
      await this.saveUserRepository(user);
    }
  }

  async saveAssignedUser(user: UserEntity): Promise<number> {
    const code = this.buildTfaCode();
    user.authConfirmCode = this.toEncrypt(code);
    await this.saveUserRepository(user);

    return code;
  }

  // async updateAssignSequence(tfaEnable: boolean, user: UserEntity): Promise<void> {
  async sendTfaMail(tfaEnable: boolean, user: UserEntity, code: number): Promise<void> {
    if (tfaEnable) {
      this.emailService.signup(user.login, code);
      return;
    }
  }

  @UsePipes(ValidationPipe)
  async tfaConfirm(login: string, code: number): Promise<ResDataDto> {
    const user = await this.findWhoInUser(login);
    const isMatch = user !== null && user.authConfirmCode === this.toEncrypt(code);
    // const isMatch = user !== null && user.authConfirmCode === code;


    if (isMatch) {
      const token = this.encode({login, validate: true});
      const expire = this.configService.get('token.expire');
      const options = this.buildCookieOption(expire);
          // await this.sendTfaMail(false, user, 0);
      const result: ResDataDto = {
        token,
        options,
        tfaEnable: user.tfaEnable,
        send: {result: true},
      };

      return result;
    }
    throw new BadRequestException();
  }

  // @UsePipes(ValidationPipe)
  // async withdraw(login: string): Promise<void> {
  //   await this.mustOnline(login);
  //   await this.delete(login);
  // }

  // @UsePipes(ValidationPipe)
  // async delete(login: string): Promise<void> {
  //   await this.deleteUser(login);
  // }

  async updateNickname(login: string, nickname: string): Promise<void> {
    this.haveExcludedString(nickname, this.configService.get('ft.nickname_prefix'));
    await this.mustOnline(login);
    await this.databaseService.updateUserNickname(login, nickname);
    const broadcast = 'http://socket:3001/profile_update?login=' + login;
    await this.http.axiosRef(broadcast).catch(e => {
      throw new BadRequestException(e);
    });
  }

  @UsePipes(ValidationPipe)
  async updateAvatarImage(login: string, avatarDataDto: AvatarDataDto): Promise<void> {
    this.compareTokenAndUser(login, avatarDataDto);
    await this.mustOnline(avatarDataDto.login);
    await this.databaseService.updateUserAvatar(login, avatarDataDto.avatar);

    const broadcast = 'http://socket:3001/profile_update?login=' + login;
    await this.http.axiosRef(broadcast).catch(e => {
      throw new BadRequestException(e);
    });
  }

  @UsePipes(ValidationPipe)
  compareTokenAndUser(login: string, avatarDataDto: AvatarDataDto): void {
    if (login !== avatarDataDto.login) throw new BadRequestException();
  }

  haveExcludedString(source: string, excludeString: string) {
    const split = source.split(excludeString).length;
    if (split > 1) {
      throw new BadRequestException();
    }
  }

  decode(token: string): TokenData {
    return this.jwtService.decode(token) as TokenData;
  }

  verify(token: string): TokenData {
    const secret = this.configService.get('token.secret');
    // return { login: this.jwtService.verify(token, {secret}).login };
    return this.jwtService.verify(token, {secret}) as TokenData;
  }

  encode(source: any): string {
    return this.jwtService.sign( source, {
      secret: this.configService.get('token.secret'),
      expiresIn: this.configService.get('token.expire'),
    });
  }

  async buildAuthorizedRedirection(login: string, data: ResDataDto): Promise<string> {
    const client_host = this.configService.get('front.host_ip');
    const client_port = this.configService.get('front.port');

    const user = await this.findWhoInUser(login);
    const code = await this.saveAssignedUser(user);
    await this.sendTfaMail(user.tfaEnable, user, code);

    return 'http://' + client_host + ':' + client_port;
    
//     let result = 'http://' + client_host + ':' + client_port;
//     // if (user.tfaEnable) {
//     //   result += '/tfa';
//     // }
//     if (data.isNew === true) {
//       result += '/profile';
//     }

// // console.log(user.tfaEnable);
// //     const result = 'http://' + client_host + ':' + client_port + (user.tfaEnable ? '/tfa': '');
// // console.log('in buildAuthorizedRedirection RESULT', result);
//     return result;
  }

  buildCookieOption(maxAge: number): { httpOnly: boolean, maxAge: number } {
    return { httpOnly: true, maxAge };
  }

  /**
   * include min, exclude max
   * @param min 
   * @param max 
   * @returns 
   */
  buildRandomNumber(min: number, max:number): number {
    return Math.floor(min + Math.random() * (max - min));
  }

  buildTfaCode(): number {
    return this.buildRandomNumber(100000, 1000000);
  }

  @UsePipes(ValidationPipe)
  buildUserEntity(userOAuthDto: UserOAuthDto): UserEntity {
    const { login, accessToken, refreshToken } = userOAuthDto;
    const nickname =
      this.configService.get<string>('ft.nickname_prefix') + login;
    const avatar = 'avatar.png';
    const authConfirmCode: number = 0;
    return {
      login,
      createAt: new Date(),
      nickname,
      avatar,
      tfaEnable: false,
      authConfirmCode,
      // gameRatio: ,
      accessToken,
      refreshToken,
    } as UserEntity;
  }

  // buildGameEntity(login: string, enemy_login: string): GameEntity {
  //   return {
  //     login,
  //     enemy_login,
  //     isWin: false,
  //     begin: new Date(),
  //     end: undefined,
  //   } as GameEntity;
  // }


  async addFriend(owner: string, friend: string) {
    const isExist = await this.databaseService.isFriend(owner, friend);
    if (!!isExist) throw new BadRequestException();

    const ownerEntity = await this.databaseService.whoIsUser(owner);
    if (!ownerEntity) throw new BadRequestException();

    const friendEntity = await this.databaseService.whoIsUser(friend);
    if (!friendEntity) throw new BadRequestException();

    await this.databaseService.addFriend(ownerEntity, friendEntity);
    const broadcast = 'http://socket:3001/addFriend?owner=' + owner + '&friend=' + friend;
    await this.http.axiosRef(broadcast).catch(e => { throw new BadRequestException(e) });
  }

  async removeFriend(owner: string, friend: string) {
    const isExist = await this.databaseService.isFriend(owner, friend);
    if (!isExist) throw new BadRequestException();

    await this.databaseService.removeFriend(isExist);
    const broadcast = 'http://socket:3001/removeFriend?owner=' + owner + '&friend=' + friend;
    await this.http.axiosRef(broadcast).catch(e => { throw new BadRequestException(e) });
  }

  async addBlock(owner: string, block: string) {
    const isExist = await this.databaseService.isBlock(owner, block);
    if (!!isExist) throw new BadRequestException();

    const ownerEntity = await this.databaseService.whoIsUser(owner);
    if (!ownerEntity) throw new BadRequestException();

    const blockEntity = await this.databaseService.whoIsUser(block);
    if (!blockEntity) throw new BadRequestException();

    await this.databaseService.addBlock(ownerEntity, blockEntity);
    const broadcast = 'http://socket:3001/addBlock?owner=' + owner + '&block=' + block;
    await this.http.axiosRef(broadcast).catch(e => { throw new BadRequestException(e) });
  }

  async removeBlock(owner: string, block: string) {
    const isExist = await this.databaseService.isBlock(owner, block);
    if (!isExist) throw new BadRequestException();

    await this.databaseService.removeBlock(isExist);
    const broadcast = 'http://socket:3001/removeBlock?owner=' + owner + '&friend=' + block;
    await this.http.axiosRef(broadcast).catch(e => { throw new BadRequestException(e) });
  }

  async isFriend(login: string, friend_login: string): Promise<boolean> {
    return !!(await this.databaseService.isFriend(login, friend_login));
  }

  async isBlock(login: string, block_login: string): Promise<boolean> {
    return !!(await this.databaseService.isBlock(login, block_login));
  }

  toEncrypt(source: number): number {
    return source ^ this.seed;
  }




  /* test req */
  // async testReq(login: string) {
  //   // const login = this.decode(token).login;
  //   const me = 'http://socket:3001/api/reqtest?who=' + login;
  //   await this.http
  //     .axiosRef(me)
  //     .catch((e) => { throw new BadRequestException(e); });
  // }
}
