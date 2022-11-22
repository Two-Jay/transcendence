import { Injectable } from '@nestjs/common';

import { MessageDataDto } from 'src/dto/message.data.dto';
import { ChatRoomDto } from 'src/dto/chat.room.dto';
import { BusDto } from 'src/dto/bus.dto';
import { RoomType } from 'src/dto/enum';
import { AppService } from 'src/app.service';

import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  constructor(
    private readonly appService: AppService,
  ) {}

  private readonly roomType = [
    RoomType.private,
    RoomType.public,
    RoomType.protected,
  ]

  buildChatRoomDto(roomId: number, socket: Socket, payload: MessageDataDto): BusDto {
    if (!payload.option) { return { result: false, value: null } as BusDto }
    if (!payload.option.title) { return { result: false, value: null } as BusDto }

    const roomType: RoomType = this.roomType.find(e => e.toString() === payload.content);
    if (!roomType) { return { result: false, value: null } as BusDto }

    const login = this.appService.loginFromSocket(socket);
    if (!login.result) { return login; }

    const admin = new Map<string, string>();
    admin.set(login.value, login.value);
    
    const owner = login.value;

    const member = new Map<string, string>();
    member.set(socket.id, socket.id);

    const dupMember = new Map<string, number>();
    dupMember.set(login.value, 1);

    return {
      result: true,
      value: {
        roomId,
        roomType,
        // password: payload.option.password,
        title: payload.option.title,
        owner,
        admin,
        member,
        dupMember,
        invite: new Map<string, string>(),
        banUser: new Map<string, string>(),
        mute: new Map<string, number>(),
      } as ChatRoomDto
    } as BusDto;
  }
}
