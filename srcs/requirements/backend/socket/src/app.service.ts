// import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BusDto } from 'src/dto/bus.dto';

import { Socket } from 'socket.io';
// import { Cache } from 'cache-manager'
import { parse } from 'cookie';
import { TokenData } from './config/struct';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    // @Inject(CACHE_MANAGER)
    // private cacheManager: Cache,
  ) {  }

  room_id: number = 0;

  increaseCount(key: any, map: Map<any, number>): BusDto {
    const count = map.get(key) ?? 0;
    map.set(key, count + 1);
    return { result: true, value: map } as BusDto;
  }

  decreaseCount(key: any, map: Map<any, number>): BusDto {
    const value = map.get(key);
    if (!value) return { result: false, value: map } as BusDto;

    const count = Number(value) - 1;
    if (count <= 0) {
      map.delete(key);
      return { result: false, value: map } as BusDto;
    }

    map.set(key, count);
    return { result: true, value: map } as BusDto;
  }

  appendElementInArray(target: any, source: any[]): BusDto {
    const isDuplicate = source.find(e => e === target);
    if (isDuplicate) {
      return { result: false, value: source };
    }
    return { result: true, value: source.push(target) };
  }

  removeElementInArray(target: any, source: any[]): BusDto {
    const newArray = source.filter(e => e !== target);
    return { result: newArray.length !== source.length, value: newArray };
  }

  loginFromString(login: string): BusDto {
    if (!login || login.length === 0 || login[0] !== '%') {
      return { result: false, value: null } as BusDto;
    }
    return { result: true, value: login.slice(1, login.length) } as BusDto;
  }

  loginFromSocket(client: Socket): BusDto {
    const cookie = this.parseCookie(client);
    if (!cookie.result) return { result: false, value: null } as BusDto;

    const decode = this.decode(cookie.value.token) as TokenData;
    const result = !(!decode || decode.login.length === 0 || !decode.validate);
    const value = decode?.login;
    return { result, value } as BusDto;
  }

  decode(token: string): any {
    return this.jwtService.decode(token);
  }

  encode(source: string): any {
    return this.jwtService.sign(source, {expiresIn: 86400000});
  }

  parseCookie(client: Socket): BusDto {
    if (!client.handshake.headers.cookie) {
      return { result: false, value: null } as BusDto;
    }
    return { result: true, value: parse(client.handshake.headers.cookie) } as BusDto;
  }

  // async isOnline(login: string): Promise<boolean> {
  //   const isOnline = await this.cacheManager.get(login);
  //   return !!isOnline;
  // }

  // async increaseConnection(login: string): Promise<BusDto> {
  //   const current = await this.cacheManager.get(login);
  //   const count = !current ? 1 : Number(current) + 1;
  //   await this.cacheManager.set(login, count);
  //   return { result: true, value: count } as BusDto;
  // }

  // async decreaseConnection(login: string): Promise<BusDto> {
  //   const current = await this.cacheManager.get(login);
  //   if (!current) return { result: false, value: null } as BusDto;

  //   const count = Number(current) - 1;
  //   if (count < 0) return { result: false, value: null } as BusDto;

  //   if (count === 0) {
  //     await this.cacheManager.del(login);
  //   }
  //   else {
  //     await this.cacheManager.set(login, count);
  //   }

  //   return { result: true, value: count } as BusDto;
  // }










  newRoomId() {
    return ++this.room_id;
  }

  roomId(room_id: string): BusDto {
    if (!room_id || room_id.length < 2 || room_id[0] !== '#')
      return { result: false, value: null } as BusDto;

    return { result: true, value: Number(room_id.slice(1, room_id.length)) } as BusDto;  
  }

  cloneMessage<T>(payload: any): T {
    return JSON.parse(JSON.stringify(payload)) as T;
  }

  // async verifyWhoAreYou() {
  //   console.log('verify who are you');
  // }
}
