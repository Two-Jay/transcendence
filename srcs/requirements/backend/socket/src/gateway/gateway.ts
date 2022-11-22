import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { AuthGuard } from "@nestjs/passport";
import { ClassSerializerInterceptor, Logger, UseGuards } from "@nestjs/common";
// import { Logger } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";
import { ChatService } from "src/chat/chat.service";
import { GameService } from "src/game/game.service";
import { AppService } from "src/app.service";

import { MessageDataDto } from "src/dto/message.data.dto";
import { ChatRoomDto } from "src/dto/chat.room.dto";
import { GameRoomDto } from "src/dto/game.room.dto";

import { Socket, Server } from 'socket.io';
import { RoomType } from "src/dto/enum";
import { GamePlayDto } from "src/dto/game.play.dto";
// import { UserEntity } from "src/entity/user.entity";
import { GameMode, IDetail, IPair, Move } from "src/config/struct";

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly appService: AppService,
        private readonly chatService: ChatService,
        private readonly gameService: GameService,
        private readonly databaseService: DatabaseService,
    ) {}

    @WebSocketServer()
    server: Server;

    sockets_socketId_socket             = new Map<string, Socket>(); // socket_id, socket
    userSockets_login_socketArray       = new Map<string, Socket[]>(); // login, socket.array

    chatRooms_chatRoomId_chatRoomDto    = new Map<number, ChatRoomDto>(); // room_id, ChatRoomDto
    userSocket_socketId_chatRoomId      = new Map<string, number | null>(); // socket_id, room_id

    duelRequest_login_login             = new Map<string, string>(); // login, enemy_login
    duelRequested_login_login           = new Map<string, string>(); // login, enemy_login
    duelRequestOption_login_speed       = new Map<string, number>(); // login, speed

    matchRequest_login_normal            = new Map<string, string>(); // login, mode
    matchRequest_login_speedy           = new Map<string, string>(); // login, mode

    games_gameRoomId_game               = new Map<number, Game>(); // game.room_id, game
    // gameRooms_gameRoomId_gameRoomDto    = new Map<number, GameRoomDto>(); // game.room_id, game.room.dto
    userSocket_socketId_gameRoomId      = new Map<string, number | null>(); // socket_id, room_id

    matchedGame_login_gameRoomId        = new Map<string, number>(); // login, game.room_id;

    game_fps = 60;
    game_finish_score = 3;
    game_sudden_death = 1;
    mute_duration = 30;
    game_delay = 20;
    reset_delay = 3;
    // ball_speed = 15;
    paddle_speed = 15;
    fast_ball = 45;
    seed = Number(process.env.SEED);
    game_pi = 3.14159;
    // seed = 9385;

    async afterInit(server: any) {
console.log('INIT socket server');
        // await this.databaseService.resetRedis();
        await this.databaseService.clearRooms();
        await this.databaseService.clearHistory();
        await this.databaseService.clearConnectionCount();
// await this.databaseService.showAllUser();
    }

    //@UseGuards(AuthGuard('token'))
    async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]): Promise<void> {
// Logger.log(`connedted [${client.id}]`);
console.log('Connected:', client.id);
        const login = this.appService.loginFromSocket(client);
        // if (!login.result) return await this.handleDisconnect(client);
        if (!login.result) return await this.cutSocket(client, 'handleConnection: login is invailed');

        // await this.databaseService.increaseConnection(login.value);
        // this.appendLoginSocket(client, login.value);
        await this.databaseService.setConnectionCount(login.value, this.appendLoginSocket(client, login.value));
        this.sendSocket('_connect', client.id, { author: '%SYSTEM%'});
        this.sendOnlineStatusToFriends(login.value, true);
    }

    async handleDisconnect(@ConnectedSocket() client: Socket): Promise<void> {
console.log('Disconnedted:', client.id);
        const login = this.appService.loginFromSocket(client);
        if (!login.result) return;

        await this.databaseService.setConnectionCount(login.value, this.deleteLoginSocket(client, login.value));
        // await this.databaseService.decreaseConnection(login.value);
        // this.sockets_socketId_socket.delete(client.id);

        const chatRoomId = this.userSocket_socketId_chatRoomId.get(client.id);
        if (chatRoomId) {
            this.handleLeaveChatRoom(client, { scope: '#' + chatRoomId } as MessageDataDto);
            this.userSocket_socketId_chatRoomId.delete(client.id);
        }

        const gameRoomId = this.matchedGame_login_gameRoomId.get(login.value);
        if (gameRoomId) {
            const game = this.games_gameRoomId_game.get(gameRoomId);

            if (game.getRoom().playerSocketId[0] === client.id || game.getRoom().playerSocketId[1] === client.id)
                this.handleGiveupGame(client, game.getPlay());
        }

        const obsRoomId = this.userSocket_socketId_gameRoomId.get(client.id);
        if (obsRoomId) {
            this.handleLeaveGameRoom(client, { roomId: obsRoomId } as GamePlayDto);
            this.userSocket_socketId_gameRoomId.delete(client.id);
        }

        if (!this.userSockets_login_socketArray.get(login.value)) {
            this.sendOnlineStatusToFriends(login.value, false);
        }
        // if (!(await this.databaseService.isOnline(login.value))) {
        //     this.sendOnlineStatusToFriends(login.value, false);
        // }

        // this.deleteLoginSocket(client, login.value);
        
        if (!this.userSockets_login_socketArray.get(login.value))
            this.clearGameQueue(login.value, null);

        client.emit('_disconnect', { author: '%SYSTEM%' });
        client.disconnect(true);
        this.sendUser('_is_alive', login.value, null);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('welcome_kit')
    async handleWelcomeKit(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto) {
console.log('welcome_kit payload :', payload);
// await this.databaseService.showAllUser();
        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'welcome_kit: login is invailed');//return await this.handleDisconnect(client);

        const welcome_kit = {
            option: [
                await this.databaseService.getWhoDetail(login.value),
                await this.mergeDetailListForWelcomeKit(login.value),
                this.chatRoomArray([RoomType.public, RoomType.protected]),
                this.gameRoomArray(),
            ]
        } as MessageDataDto;

        this.sendSocket('_welcome_kit', client.id, welcome_kit);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('create_room')
    async handleCreateChatRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto) {
console.log('create_room payload :', payload);
        if (!payload || !payload.option) return await this.cutSocket(client, 'create_room: payload is invailed');//return await this.handleDisconnect(client);

        const login = this.appService.loginFromSocket(client);
        if (!login.result) return;

        const isMembered = this.userSocket_socketId_chatRoomId.get(client.id) !== null;
        if (isMembered) return await this.cutSocket(client, 'create_room: already memver');//return await this.handleDisconnect(client);

        const user = await this.databaseService.whoIsUser(login.value);
        if (!user) return await this.cutSocket(client, 'create_room: not a user');//return await this.handleDisconnect(client);

        const roomId = this.appService.newRoomId();
        const chatRoomDto = this.chatService.buildChatRoomDto(roomId, client, payload);
        if (!chatRoomDto.result) return await this.cutSocket(client, 'create_room: can not create room');//return await this.handleDisconnect(client);
        if (payload.option.password) {
            chatRoomDto.value.password = this.toEncrypt(payload.option.password);
console.log('salted', chatRoomDto.value.password);
        }

        this.userSocket_socketId_chatRoomId.set(client.id, roomId);
        this.chatRooms_chatRoomId_chatRoomDto.set(roomId, chatRoomDto.value);

        payload.scope = '#' + roomId;
        payload.author = '%SYSTEM%';

// console.log('payload.scope in CREATE CHAT ROOM', payload.scope);
        if (payload.content !== 'private') {
            // payload.scope = '#' + roomId;
            this.sendBroadcast('_create_room', payload);
        }
        else {
            // payload.scope = '#' + roomId;
            client.emit('_create_room', payload);
        }

        payload.author = '%' + login.value;
        await this.databaseService.addChatMember(login.value, roomId);
        // payload.option = await this.databaseService.roomChatMemberDetail(roomId);
        payload.option = await this.chatRoomMemberDetail(roomId);

        client.emit('_join_room', payload);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('join_room')
    async handleJoinChatRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto) {
console.log('join_room payload :', payload);
        if (!payload) return await this.cutSocket(client, 'join_room: payload invailed');//return await this.handleDisconnect(client);

        const roomId = this.appService.roomId(payload.scope);
        if (!roomId.result) return //await this.cutSocket(client, 'handleConnection: login is invailed');//return await this.handleDisconnect(client);

        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'join: login is invailed');//return await this.handleDisconnect(client);

        const chatRoomDto = this.chatRooms_chatRoomId_chatRoomDto.get(roomId.value);
        if (!chatRoomDto) {
            // 존재하지 않는 채팅방
            this.sendSocket('_join_room', client.id, payload);
            return;
            // this.sendSocket('_join_room', client.id, { author: '%SYSTEM%', scope: 'error', content: 'not exist room' } as MessageDataDto);
        }
// console.log('check invite', chatRoomDto);
        if (chatRoomDto.invite.get(login.value)) {
            // 초대 목록에 있으면 그냥 입장시킴 (구지 비밀번호 입력받고 같은 귀찮음 패스)
            // ban 되었더라도, 입장 시켜줌... 초대 받았으면...
            chatRoomDto.invite.delete(login.value);
        }
        else if (chatRoomDto.banUser.get(login.value)) {
            // ban된 방이면, 입장 불가
            payload.option = 'banned';
            client.emit('_banned_room', payload); //FIX reply command change
            // this.sendSocket('_join_room', client.id, payload);
            return;
        }
        else if (chatRoomDto.roomType === 'protected') {
            // 비밀번호 오류
            if (!payload.option)
            {
                payload.option = 'wrong password';
                client.emit('_wrong_password_room', payload); //FIX reply command change
                // this.sendSocket('_join_room', client.id, payload);
                return;
            }
            const salted = this.toEncrypt(payload.option.password);
console.log('salted in join room', salted);
console.log('chatRoom password', chatRoomDto.password);
            if (chatRoomDto.password !== salted) {
                payload.option = 'wrong password';
                client.emit('_wrong_password_room', payload); //FIX reply command change
                // this.sendSocket('_join_room', client.id, payload);
                return;
            }
        }

        const currentRoom = this.userSocket_socketId_chatRoomId.get(client.id);
        // 같은방에 다시 들어가려고 하면 무시
        if (currentRoom === roomId.value) {
// console.log('dont try RE-enter same room');
            return; // this.handleDisconnect(client);
        }
        // 다른 방에 있었다면, 그방을 나감
        if (currentRoom) {
            this.handleLeaveChatRoom(client, { scope: '#' + currentRoom } as MessageDataDto);
        }

        this.userSocket_socketId_chatRoomId.set(client.id, roomId.value);

        chatRoomDto.member.set(client.id, client.id);
        const dupMember = this.appService.increaseCount(login.value, chatRoomDto.dupMember);
        if (!dupMember.result) return;
        chatRoomDto.dupMember = dupMember.value;

        payload.author = '%SYSTEM%';
        payload.content = '%' + login.value;

        await this.databaseService.addChatMember(login.value, roomId.value);
        payload.option = await this.chatRoomMemberDetail(roomId.value);
// await this.test(payload.option);

        if (dupMember.value.get(login.value) === 1) {
            // 채팅방에 처음 들어갈때만 안내 메시지 보냄
            this.sendChatRoom('_join_room', roomId.value, payload);
        } else {
            // 이미 있으면, 입장자 소켓에만 보냄
            client.emit('_join_room', payload);
            // this.sendSocket('_join_room', client.id, payload);
        }
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('leave_room')
    async handleLeaveChatRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto) {
console.log('leave_room payload :', payload);
        const roomId = this.userSocket_socketId_chatRoomId.get(client.id);
        if (!roomId) return await this.cutSocket(client, 'leave_room: not in the room');//return await this.handleDisconnect(client);

        this.userSocket_socketId_chatRoomId.set(client.id, null);

        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'leave_room: login is invailed');//return await this.handleDisconnect(client);

        const chatRoomDto = this.chatRooms_chatRoomId_chatRoomDto.get(roomId);
        if (!chatRoomDto) return await this.cutSocket(client, 'leave_room: room is not exist');//return await this.handleDisconnect(client);
        chatRoomDto.member.delete(client.id);

        const dupMember = this.appService.decreaseCount(login.value, chatRoomDto.dupMember);
        chatRoomDto.dupMember = dupMember.value;

        if (!chatRoomDto.dupMember.get(login.value)) chatRoomDto.admin.delete(login.value);

        const messageSocket = this.buildMessageDataDto('%' + login.value, '#' + roomId, '%' + login.value);
        messageSocket.option = [];
        const messageRoom = this.buildMessageDataDto('%SYSTEM%', '#' + roomId, '%' + login.value);
        client.emit('_leave_room', messageSocket);

        if (chatRoomDto.dupMember.size === 0) {
            this.sendBroadcast('_delete_room', { author: '%SYSTEM%', scope: '#' + roomId } as MessageDataDto);
            this.chatRooms_chatRoomId_chatRoomDto.delete(roomId);
            await this.databaseService.removeChatMember(login.value, roomId);
            return;
        }

        if (!chatRoomDto.dupMember.get(login.value)) {
// leave 처리 시작
            await this.databaseService.removeChatMember(login.value, roomId);
// leave 처리 끝
            messageRoom.option = await this.chatRoomMemberDetail(roomId);

            // messageRoom.option = Array.from(chatRoomDto.dupMember.keys(), e => e);
            this.sendChatRoom('_leave_room', roomId, messageRoom );
        }
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('invite_room')
    async handleInviteChatRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto) {
console.log('invite_room payload :', payload);
        if (!payload) return await this.cutSocket(client, 'invite_room: payload is invailed');//return await this.handleDisconnect(client);

        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'invite_room: login is invailed');//return await this.handleDisconnect(client);

        const roomId = this.userSocket_socketId_chatRoomId.get(client.id);
        if (!roomId) return await this.cutSocket(client, 'invite_room: not in room');//return await this.handleDisconnect(client);

        const chatRoomDto = this.chatRooms_chatRoomId_chatRoomDto.get(roomId);
        if (!chatRoomDto) return await this.cutSocket(client, 'invite_room: room is not exist');//return await this.handleDisconnect(client);

        // if (!chatRoomDto.admin.get(login.value)) return await this.cutSocket(client, 'invite_room: is not admin');//return await this.handleDisconnect(client);
        if (chatRoomDto.owner !== login.value) return await this.cutSocket(client, 'invite_room: is not owner');//return await this.handleDisconnect(client);

        const target = this.appService.loginFromString(payload.content);
        payload.author = '%' + login.value;
        payload.scope = '#' + roomId;

        chatRoomDto.invite.set(target.value, target.value);

        const socketArray = this.userSockets_login_socketArray.get(target.value);
        if (!socketArray) return;
        socketArray.forEach(e => e.emit('_invite_room', payload));

        payload.author = '%SYSTEM%';
        this.sendChatRoom('_invite_room', roomId, payload);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('password')
    async handlePasswordChatRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto) {
console.log('password payload :', payload);
        // if (!payload || !payload.option) return await this.cutSocket(client, 'password: login is invailed');//return await this.handleDisconnect(client);

        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'password: login is invailed');//return await this.handleDisconnect(client);

        // payload.author = this.appService.loginFromSocket(client).value;
        // if (!payload.author) return await this.handleDisconnect(client);

        const roomId = this.userSocket_socketId_chatRoomId.get(client.id);
        if (roomId === null) return await this.cutSocket(client, 'password: roomId is invailed');//return await this.handleDisconnect(client);

        const chatRoomDto = this.chatRooms_chatRoomId_chatRoomDto.get(roomId);
        if (!chatRoomDto) return await this.cutSocket(client, 'password: room is invailed');//return await this.handleDisconnect(client);
        if (chatRoomDto.roomType === RoomType.private) return;

        // if (!chatRoomDto.admin.get(login.value)) return await this.cutSocket(client, 'password: not admin');//return await this.handleDisconnect(client);
        if (chatRoomDto.owner !== login.value) return await this.cutSocket(client, 'password: is not owner');//return await this.handleDisconnect(client);

        if (!payload.option) {
            chatRoomDto.roomType = RoomType.public;
            this.sendBroadcast('_password', { author: '%SYSTEM%', scope: '#' + roomId, content: 'public' } as MessageDataDto);
        }
        else {
            chatRoomDto.password = this.toEncrypt(payload.option);
            chatRoomDto.roomType = RoomType.protected;
            this.sendBroadcast('_password', { author: '%SYSTEM%', scope: '#' + roomId, content: 'protected' } as MessageDataDto);
        }


        payload.author = '%' + login.value;
        payload.scope = '#' + roomId;
        payload.option = 'password changed';
        this.sendChatRoom('_password', roomId, payload);
        // this.sendChatOwner('_password', roomId, payload);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('mute')
    async handleMuteChatRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto) {
console.log('mute payload :', payload);
        if (!payload) return await this.cutSocket(client, 'mute: payload is invailed');//return await this.handleDisconnect(client);

        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'mute: login is invailed');//return await this.handleDisconnect(client);

        const roomId = this.userSocket_socketId_chatRoomId.get(client.id);
        if (roomId === null) return await this.cutSocket(client, 'mute: roomId is invailed');//return await this.handleDisconnect(client);

        const chatRoomDto = this.chatRooms_chatRoomId_chatRoomDto.get(roomId);
        if (!chatRoomDto) return await this.cutSocket(client, 'mute: room is invailed');//return await this.handleDisconnect(client);

        if (!chatRoomDto.admin.get(login.value)) return await this.cutSocket(client, 'mute: is not admin');//return await this.handleDisconnect(client);

        const target = this.appService.loginFromString(payload.content);

        if (!chatRoomDto.dupMember.get(target.value)) return;
        const finishTime: number = Math.floor(Date.now() / 1000) + Number(this.mute_duration);
        chatRoomDto.mute.set(target.value, finishTime);

        payload.author = '%' + login.value;
        payload.scope = '#' + roomId;
        payload.option = finishTime;
        this.sendChatRoom('_mute', roomId, payload);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('be_admin')
    async handleBeAdminChatRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto) {
console.log('be_admin payload :', payload);
        if (!payload) return await this.cutSocket(client, 'be_admin: payload is invailed');//return await this.handleDisconnect(client);

        const login = this.appService.loginFromSocket(client);
        if (!login.value) return await this.cutSocket(client, 'be_admin: login is invailed');//return await this.handleDisconnect(client);

        const roomId = this.userSocket_socketId_chatRoomId.get(client.id);
        if (roomId === null) return await this.cutSocket(client, 'be_admin: roomId is invailed');//return await this.handleDisconnect(client);

        const chatRoomDto = this.chatRooms_chatRoomId_chatRoomDto.get(roomId);
        if (!chatRoomDto) return await this.cutSocket(client, 'be_admin: room is invailed');//return await this.handleDisconnect(client);
        
        // if (!chatRoomDto.admin.get(login.value)) return await this.cutSocket(client, 'be_admin: not admin');//return await this.handleDisconnect(client);
        if (chatRoomDto.owner !== login.value) return await this.cutSocket(client, 'be_admin: is not owner');//return await this.handleDisconnect(client);

        const target = this.appService.loginFromString(payload.content);

        chatRoomDto.admin.set(target.value, target.value);
        payload.author = '%' + login.value;
        payload.scope = '#' + roomId;
        payload.option = await this.chatRoomMemberDetail(roomId);
        this.sendChatRoom('_be_admin', roomId, payload);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('kick')
    async handleKickChatRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto) {
console.log('kick payload :', payload);
        if (!payload) return await this.cutSocket(client, 'kick: payload is invailed')//return await this.handleDisconnect(client);

        const login = this.appService.loginFromSocket(client);
        if (!login.value) return await this.cutSocket(client, 'kick: login is invailed')//return await this.handleDisconnect(client);

        const roomId = this.userSocket_socketId_chatRoomId.get(client.id);
        if (roomId === null) return await this.cutSocket(client, 'kick: roomId is invailed')//return await this.handleDisconnect(client);

        const chatRoomDto = this.chatRooms_chatRoomId_chatRoomDto.get(roomId);
        if (!chatRoomDto) return await this.cutSocket(client, 'kick: room is invailed')//return await this.handleDisconnect(client);

        if (!chatRoomDto.admin.get(login.value)) return await this.cutSocket(client, 'kick: not admin')//return await this.handleDisconnect(client);

        const target = this.appService.loginFromString(payload.content);

        const count = chatRoomDto.dupMember.get(target.value);
        if (!count) return;

        const socketArray = this.userSockets_login_socketArray.get(target.value);
        payload.author = '%' + login.value;
        payload.scope = '#' + roomId;
        socketArray.forEach(e => {
            if (this.userSocket_socketId_chatRoomId.get(e.id) === roomId) {
                this.handleLeaveChatRoom(e, payload);
                // this.userSocket_socketId_chatRoomId.set(e.id, null);
                // chatRoomDto.member.delete(e.id);
                this.sendSocket('_kick', e.id, payload);
            }
        });

        if (this.chatRooms_chatRoomId_chatRoomDto.get(roomId)) {
            chatRoomDto.dupMember.delete(target.value);
            payload.option = await this.chatRoomMemberDetail(roomId);
            this.sendChatRoom('_kick', roomId, payload);
        }
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('ban')
    async handleBanChatRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto) {
console.log('ban payload :', payload);
        if (!payload) return await this.cutSocket(client, 'ban: payload is invailed')//return await this.handleDisconnect(client);

        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'ban: login is invailed')//return await this.handleDisconnect(client);

        const roomId = this.userSocket_socketId_chatRoomId.get(client.id);
        if (roomId === null) return await this.cutSocket(client, 'ban: roomId is invailed')//return await this.handleDisconnect(client);

        const chatRoomDto = this.chatRooms_chatRoomId_chatRoomDto.get(roomId);
        if (!chatRoomDto) return await this.cutSocket(client, 'ban: room is invailed')//return await this.handleDisconnect(client);

        if (!chatRoomDto.admin.get(login.value)) return await this.cutSocket(client, 'ban: is not admin')//return await this.handleDisconnect(client);

        const target = this.appService.loginFromString(payload.content);

        chatRoomDto.banUser.set(target.value, target.value);

        const count = chatRoomDto.dupMember.get(target.value);
        if (!count) return;

        const socketArray = this.userSockets_login_socketArray.get(target.value);
        payload.author = '%' + login.value;
        payload.scope = '#' + roomId;
        socketArray.forEach(e => {
            if (this.userSocket_socketId_chatRoomId.get(e.id) === roomId) {
                this.handleLeaveChatRoom(e, payload);
                // this.userSocket_socketId_chatRoomId.set(e.id, null);
                // chatRoomDto.member.delete(e.id);
                this.sendSocket('_ban', e.id, payload);
            }
        });
        if (this.chatRooms_chatRoomId_chatRoomDto.get(roomId)) {
            chatRoomDto.dupMember.delete(target.value);
            payload.option = await this.chatRoomMemberDetail(roomId);
            this.sendChatRoom('_ban', roomId, payload);
        }
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('private')
    async handlePrivateMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto): Promise<void> {
console.log('private payload :', payload);
        if (!payload) return await this.cutSocket(client, 'private: payload is invailed')//return await this.handleDisconnect(client);

        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'private: login is invailed')//return await this.handleDisconnect(client);

        const target = this.appService.loginFromString(payload.scope);
        if (!target.result) return;

        payload.author = '%' + login.value;
        this.sendUser('_private', target.value, payload);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('room')
    async handleRoomMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto): Promise<void> {
console.log('room payload :', payload);
        if (!payload) return await this.cutSocket(client, 'room: payload is invailed')//return await this.handleDisconnect(client);

        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'room: login is invailed')//return await this.handleDisconnect(client);

        const roomId = this.userSocket_socketId_chatRoomId.get(client.id);
        if (!roomId) return await this.cutSocket(client, 'room: roomId is invailed')//return await this.handleDisconnect(client);

        const chatRoomDto = this.chatRooms_chatRoomId_chatRoomDto.get(roomId);
        if (!chatRoomDto) return await this.cutSocket(client, 'room: room is invailed')//return await this.handleDisconnect(client);

        const isMember = chatRoomDto.dupMember.get(login.value);
        if (!isMember) return await this.cutSocket(client, 'room: member is invailed')//return await this.handleDisconnect(client);

        const isMute = chatRoomDto.mute.get(login.value);
        const now = Math.floor(Date.now() / 1000);
        if (isMute && now < isMute) return;
        if (isMute) chatRoomDto.mute.delete(login.value);

        payload.author = '%' + login.value;
        payload.scope = '#' + roomId;
        this.sendChatRoom('_room', roomId, payload);
    }









    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('duel')
    async handleDuelUser(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto): Promise<void> {
console.log('duel payload :', payload);
        if (!payload) return await this.cutSocket(client, 'duel: payload is invailed')//return await this.handleDisconnect(client);

        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'duel: login is invailed')//return await this.handleDisconnect(client);

        const onGame = this.isOnGamePlay(login.value);
        if (onGame) return await this.cutSocket(client, 'duel: already on game')//return await this.handleDisconnect(client);

        const target = this.appService.loginFromString(payload.scope);
        if (!target.result) return;

        const isOnline = 0 < this.userSockets_login_socketArray.get(login.value)?.length;
        // const isOnline = await this.databaseService.isOnline(target.value);
        if (!isOnline || !this.isEnableGame(target.value)) {
console.log('>> already reqed');
            payload.option = false;
            this.sendSocket('_duel', client.id, payload); // 상대가 다른 duel신청을 받고있는 상태라면, 듀열 신청 실패
            return;
        }

        await this.clearGameQueue(login.value, client);
        const speed: number = Number(payload.option) !== GameMode.speedy ? GameMode.normal : GameMode.speedy;
        
        this.duelRequest_login_login.set(login.value, target.value);
        this.duelRequested_login_login.set(target.value, login.value);
        this.duelRequestOption_login_speed.set(login.value, speed);

console.log('>> req success payload', payload);
        payload.author = '%' + login.value;
        this.sendUser('_duel', target.value, payload);
        payload.option = true;
        this.sendSocket('_duel', client.id, payload);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('cancel_duel')
    async handleCancelDuelUser(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto): Promise<void> {
console.log('cancel_duel payload :', payload);
        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'calcel_duel: login is invailed')//return await this.handleDisconnect(client);

        const target = this.duelRequest_login_login.get(login.value);
        if (!target) return //await this.cutSocket(client, 'cancel_duel: target is invailed')//return await this.handleDisconnect(client);
        if (this.duelRequested_login_login.get(target) !== login.value) return await this.cutSocket(client, 'calcel_duel: requester is invailed')//return await this.handleDisconnect(client);
        
        this.disposeDuelQueue('_cancel_duel', login.value, null);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('reject_duel')
    async handleRejectDuelUser(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto): Promise<void> {
console.log('reject_duel payload :', payload);
        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'reject_duel: login is invailed')//return await this.handleDisconnect(client);
        
        const requester = this.duelRequested_login_login.get(login.value);
        if (!requester) return;
        if (this.duelRequest_login_login.get(requester) !== login.value) return await this.cutSocket(client, 'reject_duel: requester is invalied')//return await this.handleDisconnect(client);

        this.disposeDuelQueue('_reject_duel', login.value, null);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('accept_duel')
    async handleAcceptDuelUser(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto): Promise<void> {
console.log('accept_duel payload :', payload);
        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'accept_duel: login is invailed')//return await this.handleDisconnect(client);

        const opponent = this.duelRequested_login_login.get(login.value);
        if (!opponent) return //await this.cutSocket(client, 'accept_duel: login is invailed')//return await this.handleDisconnect(client);

        if (this.isOnGamePlay(opponent) || this.isOnGamePlay(login.value)) {
            this.disposeDuelQueue('_cancel_duel', login.value, null);
            return;
        }
        if (this.duelRequest_login_login.get(opponent) !== login.value) return await this.cutSocket(client, 'accept_duel: accept is invailed')//return await this.handleDisconnect(client);

        const gameRoomId = this.appService.newRoomId();
console.log('accept_duel opponent', opponent);

        const socketArray = [null, null];
        const gameMode = this.duelRequestOption_login_speed.get(opponent);
        const gameRoom = this.gameService.buildGameRoomDto(gameRoomId, [opponent, login.value], socketArray, gameMode);


        this.registGame(gameRoom.value, gameMode);

        this.disposeDuelQueue('_accept_duel', login.value, null);
        this.createGameEntity('_my_game', gameRoom.value);
        this.sendBroadcast('_create_game', gameRoom.value);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('request_match')
    async handleRequestMatch(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto): Promise<void> {
console.log('request_match payload :', payload);
        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'request_match: login is invailed')//return await this.handleDisconnect(client);

        const onGame = this.isOnGamePlay(login.value);
        if (onGame) return await this.cutSocket(client, 'duel: already on game')//return await this.handleDisconnect(client);

        const mode = (payload && payload.option === GameMode.speedy) ? GameMode.speedy : GameMode.normal;
console.log('mode =', mode);
        if (this.isOnGamePlay(login.value)) return;

        // 듀얼 신청 되어있으면 취소
        this.clearGameQueue(login.value, client);
        // this.disposeDuelQueue('_cancel_duel', login.value, null);
        if (mode === GameMode.normal)
            this.matchRequest_login_normal.set(login.value, login.value);
        else
            this.matchRequest_login_speedy.set(login.value, login.value);

        client.emit('_request_match', null);
        // match make 시작
        this.requestMatch(mode);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('cancel_request_match')
    async handleCancelRequestMatch(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDataDto): Promise<void> {
console.log('cancel_request_match payload :', payload);
        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'cancel_request_match: login is invailed')//return await this.handleDisconnect(client);

        this.disposeDuelQueue('_cancel_request_match', login.value, null);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('join_game')
    async handleJoinGame(@ConnectedSocket() client: Socket, @MessageBody() payload: GamePlayDto): Promise<void> {
console.log('join_game payload :', payload);
        if (!payload) return await this.cutSocket(client, 'join_game: payload is invailed')//return await this.handleDisconnect(client);

        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'join_game: login is invailed')//return await this.handleDisconnect(client);

        const roomId = payload.roomId;
        if (!roomId) return await this.cutSocket(client, 'join_game: roomId is invailed')//return await this.handleDisconnect(client);

        const gameRoomDto = this.games_gameRoomId_game.get(roomId)?.getRoom();
        if (!gameRoomDto) return; // 게임룸이 없어지거나 없는 경우 처리 필요하면, 여기서 할것

        const index = gameRoomDto.player.findIndex(e => e === login.value);
console.log('is observer?', index);
        if (index === -1 || gameRoomDto.playerSocketId[index] !== null) {
console.log('is observer', index);
            if (this.userSocket_socketId_gameRoomId.get(client.id))
                this.handleLeaveGameRoom(client, payload);

            this.userSocket_socketId_gameRoomId.set(client.id, roomId);
            gameRoomDto.observer.set(client.id, client.id);
            gameRoomDto.observerCount = gameRoomDto.observer.size;
console.log('insert and after?', gameRoomDto);
            // client.emit('_observe_game', gameRoomDto.status);
            this.sendGameRoom('_observe_game', gameRoomDto.roomId, gameRoomDto);
            return; // 플레이어가 아닌 경우
        }

        this.userSocket_socketId_gameRoomId.set(client.id, roomId);
        gameRoomDto.playerSocketId[index] = client.id; // 참가 자격이 있으면, 입력 소켓을 부여 (제어권 획득?)
        // client.emit('_join_game', gameRoomDto);
        this.sendGameRoom('_join_game', gameRoomDto.roomId, gameRoomDto);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('giveup')
    async handleGiveupGame(@ConnectedSocket() client: Socket, @MessageBody() payload: GamePlayDto) {
console.log('giveup payload :', payload);
        const roomId = payload.roomId;
        if (!roomId) return await this.cutSocket(client, 'giveup: roomId is invailed')//return await this.handleDisconnect(client);

        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'giveup: login is invailed')//return await this.handleDisconnect(client);

        const game = this.games_gameRoomId_game.get(roomId);
        if (!game) return;

        const gameRoomDto = game.getRoom();
        if (!gameRoomDto) return; // 게임룸이 없어지거나 없는 경우 처리 필요하면, 여기서 할것

        const looserIndex = gameRoomDto.playerSocketId.findIndex(e => e === client.id);
        if (looserIndex < 0) return// await this.cutSocket(client, 'giveup: not a player')//return await this.handleDisconnect(client); // 유저도 아니면서 뭔 포기

        this.handleLeaveGameRoom(client, payload);
        game.setBeginForce();
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('leave_game')
    async handleLeaveGameRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: GamePlayDto) {
console.log('leave_game payload :', payload);
        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'leave_game: login is invailed')//return await this.handleDisconnect(client);

        this.disposeDuelQueue('_cancel_duel', login.value, null);

        const roomId = this.userSocket_socketId_gameRoomId.get(client.id);

        if (!roomId) return //this.handleDisconnect(client);
        this.userSocket_socketId_gameRoomId.set(client.id, null);

        const gameRoomDto = this.games_gameRoomId_game.get(roomId)?.getRoom();
        if (!gameRoomDto) return //await this.cutSocket(client, 'leave_game: room is invailed')//return await this.handleConnection(client);

        const message = this.buildMessageDataDto('%SYSTEM%', '#' + roomId, login.value);
        message.option = client.id;
        if (!gameRoomDto.observer.delete(client.id)) {
            // must player case
            const playerIndex = gameRoomDto.playerSocketId.findIndex(e => e === client.id);
            if (-1 < playerIndex) {
                gameRoomDto.playerSocketId[playerIndex] = null;
                client.emit('_leave_game', message); // 나간 사람은  sendGameRoom에서 못받으니까 여기서 전달
            }
            else return await this.cutSocket(client, 'leave_game: not user, not observer')//return await this.handleDisconnect(client);
        }
        else {
            client.emit('_leave_game', message); // 나간 사람은  sendGameRoom에서 못받으니까 여기서 전달
        }

        gameRoomDto.observerCount = gameRoomDto.observer.size;

        this.sendGameRoom('_leave_game', roomId, message);
    }

    //@UseGuards(AuthGuard('token'))
    @SubscribeMessage('move_paddle')
    async handleMovePaddle(@ConnectedSocket() client: Socket, @MessageBody() payload: Move): Promise<void> {
        const login = this.appService.loginFromSocket(client);
        if (!login.result) return await this.cutSocket(client, 'move_paddle: login is invailed')//return await this.handleDisconnect(client);

        const roomId = this.userSocket_socketId_gameRoomId.get(client.id);
        if (!roomId) return //await this.cutSocket(client, 'move_paddle: roomId is invailed')//return await this.handleDisconnect(client);
        
        const game = this.games_gameRoomId_game.get(roomId);
        if (!game) return //await this.cutSocket(client, 'move_paddle: game is invailed')//return await this.handleDisconnect(client);

        if (game.getRoom().playerSocketId.findIndex(e => e === client.id) < 0) return;

        game.movePaddle(login.value, payload);

        const gameRoomDto = game.getRoom();
        if (!gameRoomDto) return //await this.cutSocket(client, 'move_paddle: room is invailed')//return await this.handleDisconnect(client);
    }






    async finishGame(gameRoomDto: GameRoomDto, winnerIndex: number) {
        const winner = gameRoomDto.player[winnerIndex];
        await this.databaseService.endGame(gameRoomDto.roomId, winner);
        this.closeGameRoom(gameRoomDto, winner);
    }

    sendBroadcast(command: string, payload: any) {
        this.sockets_socketId_socket.forEach(e => e.emit(command, payload));
    }

    sendGameRoom(command: string, roomId: number, payload: any) {
        const gameRoomDto = this.games_gameRoomId_game.get(roomId)?.getRoom();
        if (!gameRoomDto) return;

        gameRoomDto.playerSocketId.forEach(e => {
            if (e !== null)
                this.sendSocket(command, e, payload);
        });
        gameRoomDto.observer.forEach(e => this.sendSocket(command, e, payload));
    }

    sendChatOwner(command: string, roomId: number, payload: any) {
        const chatRoomDto = this.chatRooms_chatRoomId_chatRoomDto.get(roomId);
        if (!chatRoomDto) {
            Logger.error(`not found [${roomId}] in {chatRooms_chatRoomId_chatRoomDto}`);
            return;
        }

        chatRoomDto.admin.forEach(e => this.sendSocket(command, e, payload));
    }

    sendChatRoom(command: string, roomId: number, payload: any) {
        const chatRoomDto = this.chatRooms_chatRoomId_chatRoomDto.get(roomId);
        if (!chatRoomDto) {
            Logger.error(`not found [${roomId}] in {chatRooms_chatRoomId_chatRoomDto}`);
            return;
        }

        chatRoomDto.member.forEach(e => this.sendSocket(command, e, payload));
    }

    sendSocket(command: string, socketId: string, payload: any) {
        const socket = this.sockets_socketId_socket.get(socketId);
        if (!socket) {
            Logger.error(`not found [${socketId}] in {sockets_socketId_socket}`);
            return;
        }

        socket.emit(command, payload);
    }

    sendUser(command: string, login: string, payload: any) {
        const socketArray = this.userSockets_login_socketArray.get(login);
        if (!socketArray) return;
        socketArray.forEach(e => e.emit(command, payload));
    }

    appendLoginSocket(client: Socket, login: string): number {
        const userSocketArray = this.userSockets_login_socketArray.get(login) ?? [];
        userSocketArray.push(client);

        if (userSocketArray.length === 1) {
            // this.sockets_socketId_socket.set(client.id, client);
            this.userSockets_login_socketArray.set(login, userSocketArray);
        }
        this.sockets_socketId_socket.set(client.id, client);
        this.userSocket_socketId_chatRoomId.set(client.id, null);
        this.userSocket_socketId_gameRoomId.set(client.id, null);

        return userSocketArray.length;
    }

    deleteLoginSocket(client: Socket, login: string): number {
console.log('ENTER delete login socket');
        const userSocketArray = this.userSockets_login_socketArray.get(login);
        if (!userSocketArray || !userSocketArray.length) {
            Logger.error(`not found [${login}] in {userSockets_login_socketArray}`);
            return;
        }

        this.sockets_socketId_socket.delete(client.id);

        if (userSocketArray.length === 1) {
console.log('will return 0');
            this.userSockets_login_socketArray.delete(login);
            return 0;
        }

        const newSocketArray = userSocketArray.filter(e => e.id !== client.id);
        this.userSockets_login_socketArray.set(login, newSocketArray);

        return newSocketArray.length;
}

    buildMessageDataDto(author: string, scope: string, content: string): MessageDataDto {
        return { author, scope, content } as MessageDataDto;
    }

    closeGameRoom(gameRoomDto: GameRoomDto, content: string) {
        if (!this.games_gameRoomId_game.get(gameRoomDto.roomId)) return;
        const message = this.buildMessageDataDto('%SYSTEM%', '#' + gameRoomDto.roomId, content);
        
        // this.sendGameRoom('_leave_game', gameRoomDto.roomId, message);
        // this.sendGameRoom('_end_game', gameRoomDto.roomId, message);
        this.sendBroadcast('_end_game', message);
        this.broadcastProfileUpdate(gameRoomDto.player[0]);
        this.broadcastProfileUpdate(gameRoomDto.player[1]);

        gameRoomDto.observer.forEach(e => {
            const socket = this.sockets_socketId_socket.get(e);
            if (socket)
                this.handleLeaveGameRoom(socket, gameRoomDto.status);
        });

        gameRoomDto.playerSocketId.forEach(e => {
            const socket = this.sockets_socketId_socket.get(e);
            if (socket)
                this.handleLeaveGameRoom(socket, gameRoomDto.status);
        });

        this.games_gameRoomId_game.delete(gameRoomDto.roomId);
        this.matchedGame_login_gameRoomId.delete(gameRoomDto.player[0]);
        this.matchedGame_login_gameRoomId.delete(gameRoomDto.player[1]);
    }

    chatRoomArray(filterArray: RoomType[]): any[] {
        const candidate = Array.from(this.chatRooms_chatRoomId_chatRoomDto.values(), e => {
            if (filterArray.includes(e.roomType))
                return {
                    id: '#' + e.roomId,
                    title: e.title,
                    type: e.roomType,
                };
        });

        const result = candidate.filter(e => e !== undefined);
        return candidate.filter(e => e !== undefined);
    }

    gameRoomArray(): GameRoomDto[] {
        return Array.from(this.games_gameRoomId_game.values(), e => e.getRoom());
        // return Array.from(this.gameRooms_gameRoomId_gameRoomDto.values());
    }

    requestMatch(gameMode: GameMode): void {
        const container = gameMode === GameMode.speedy ?
            this.matchRequest_login_speedy : 
            this.matchRequest_login_normal;

console.log('container size =', container.size);
        if (container.size < 2) return;

        const items = container.entries();
        const player1 = items.next();
        const player2 = items.next();

console.log('>> is correct? << p1, p2', player1, player2);

        container.delete(player1.value[0]);
        container.delete(player2.value[0]);

        const roomId = this.appService.newRoomId();
        const room = this.gameService.buildGameRoomDto(roomId, [player1.value[0], player2.value[0]], [null, null], gameMode);
        
        this.registGame(room.value, gameMode);
        
        this.createGameEntity('_my_game', this.games_gameRoomId_game.get(roomId).getRoom());
        this.sendBroadcast('_create_game', room.value);
    }

    async clearGameQueue(login: string, client: Socket): Promise<void> {
        if (!!this.matchRequest_login_normal.get(login) ||
            !!this.matchRequest_login_speedy.get(login)) {
            await this.handleCancelRequestMatch(client, null);
        }

        if (!!this.duelRequest_login_login.get(login)) {
            await this.handleCancelDuelUser(client, null);
        }

        if (!!this.duelRequested_login_login.get(login)) {
            await this.handleRejectDuelUser(client, null);
        }
    }

    // make game entity
    disposeDuelQueue(command: string, target: string, payload: MessageDataDto): void {
        const reqed = this.duelRequest_login_login.get(target);
        const reqer = this.duelRequested_login_login.get(target);
        
        if (reqed) {
            this.deleteAllGameRequests(reqed);
            this.sendUser(command, reqed, payload);
        }

        if (reqer) {
            this.deleteAllGameRequests(reqer);
            this.sendUser(command, reqer, payload);
        }

        this.deleteAllGameRequests(target);
        this.sendUser(command, target, payload);
    }

    deleteAllGameRequests(login: string): void {
        this.duelRequest_login_login.delete(login);
        this.duelRequested_login_login.delete(login);
        this.duelRequestOption_login_speed.delete(login);
        this.matchRequest_login_normal.delete(login);
        this.matchRequest_login_speedy.delete(login);
    }

    registGame(gameRoomDto: GameRoomDto, gameMode: GameMode) {
        const game = new Game(gameRoomDto, Number(gameMode), this.paddle_speed,
            (dto: GamePlayDto) => {this.sendGameRoom('_on_game', dto.roomId, dto)},
            (dto: GameRoomDto, winnerIndex: number) => {this.finishGame(dto, winnerIndex)}
        );
        this.games_gameRoomId_game.set(gameRoomDto.roomId, game);
        this.matchedGame_login_gameRoomId.set(gameRoomDto.player[0], gameRoomDto.roomId);
        this.matchedGame_login_gameRoomId.set(gameRoomDto.player[1], gameRoomDto.roomId);
    }

    async createGameEntity(command: string, payload: GameRoomDto) {
        const player1 = payload.player[0];
        const player2 = payload.player[1];

        const p1entity = this.gameService.buildGameEntity(payload.player[0], payload.player[1], payload.roomId);
        const p2entity = this.gameService.buildGameEntity(payload.player[1], payload.player[0], payload.roomId);

        if (!p1entity || !p2entity || !p1entity.login || !p2entity.login || !p1entity.enemy || !p2entity.enemy) return;
        await this.databaseService.saveGameEntity(p1entity);
        await this.databaseService.saveGameEntity(p2entity);

        this.sendUser(command, player1, payload);
        this.sendUser(command, player2, payload);
    }

    isEnableGame(target: string): boolean {
        return !this.isOnGamePlay(target) && !this.isOnRequest(target);
    }

    isOnRequest(target: string): boolean {
        return !!this.matchRequest_login_normal.get(target) ||
               !!this.matchRequest_login_speedy.get(target) ||
               !!this.duelRequest_login_login.get(target) ||
               !!this.duelRequested_login_login.get(target)
               ;
    }

    isOnGamePlay(target: string):boolean {
        return !!this.matchedGame_login_gameRoomId.get(target);
    }

    async mergeDetailListForWelcomeKit(login: string): Promise<IDetail[]> {
        const friendList = (await this.databaseService.friendList(login));
        const blockList = (await this.databaseService.blockList(login));

        const storage: Map<string, IDetail> = friendList.reduce((map, obj) => {
            obj.isFriend = true;
            obj.isBlock = false;
            map.set(obj.login, obj);
            return map;
        }, new Map);

        blockList.forEach(e => {
            e.isFriend = !!storage.get(e.login);
            e.isBlock = true;
            storage.set(e.login, e);
        });

        const result = Array.from(storage.values());
        return result;
    }

    async sendOnlineStatusToFriends(login: string, isOnline: boolean) {
        const me = await this.databaseService.whoIsUser(login);
        if (!me) return;

        const friendedList = await this.databaseService.friendedList(login);
        if (!friendedList) return;

        const myDetail = {
            login,
            nickname: me.nickname,
            avatar: me.avatar,
            isOnline,
            isFriend: true,
            isBlock: null, // N case
            ladder: me.ladder,
            matchHistory: [], // FIX need update
        } as IDetail;

        friendedList.forEach(e => {
            this.sendUser('_iDetail', e.login, { author: '%SYSTEM%', option: myDetail } as MessageDataDto);
        });
    }

    async broadcastProfileUpdate(login: string) {
      const detail = await this.databaseService.getWhoDetail(login);
      this.sendBroadcast('_iDetail', {author: '%SYSTEM%', option: detail} as MessageDataDto);
    }

    async notifyAddFriend(payload: IPair) {
        const detail = await this.databaseService.getFriendDetail(payload.key, payload.value);
        this.sendUser('_iDetail', payload.key, {author: '%SYSTEM%', option: detail} as MessageDataDto);
    }

    async notifyAddBlock(payload: IPair) {
        const detail = await this.databaseService.getBlockDetail(payload.key, payload.value);
        this.sendUser('_iDetail', payload.key, {author: '%SYSTEM%', option: detail} as MessageDataDto);
    }

    async notifyRemoveFriend(payload: IPair) {
        const detail = await this.databaseService.getUnFriendDetail(payload.value);
        this.sendUser('_iDetail', payload.key, {author: '%SYSTEM%', option: detail} as MessageDataDto);
    }

    async notifyRemoveBlock(payload: IPair) {
        const detail = await this.databaseService.getUnBlockDetail(payload.value);
        this.sendUser('_iDetail', payload.key, {author: '%SYSTEM%', option: detail} as MessageDataDto);
    }

    toEncrypt(password: number): number {
        return password ^ this.seed;
    }

    async chatRoomMemberDetail(roomId: number): Promise<IDetail[]> {
        const member = await this.databaseService.roomChatMemberDetail(roomId);
        const filteredMember = this.markAdmin(member, roomId);

        return filteredMember;
    }

    markAdmin(memberArray: IDetail[], roomId: number): IDetail[] {
        const chatRoomDto = this.chatRooms_chatRoomId_chatRoomDto.get(roomId);

        if (!memberArray || memberArray.length === 0) return null;

        memberArray.forEach(e => {

            if (chatRoomDto.owner === e.login) {
                e.isOwner = true;
                e.isAdmin = true;
                chatRoomDto.admin.set(e.login, e.login);
            }
            else if (chatRoomDto.admin.get(e.login)) {
                e.isAdmin = true;
            }
            else {
                e.isAdmin = false;
            }
        });

        return memberArray;
    }

    async cutSocket(@ConnectedSocket() client: Socket, desc?: string) {
        if (desc) {
            console.log('desc', desc);
        }
        await this.handleDisconnect(client);
    }
}







export class Game {

    constructor(
        readonly gameRoomDto: GameRoomDto,
        readonly ballSpeed: number,
        readonly paddleSpeed: number,
        readonly callback?: Function,
        readonly onComplete?: Function,
    ) {
        this.init();
    }

    gameDelay: number = 20;
    resetDelay: number = 3;
    frameDelay: number = 20;
    game_finish_score: number = 3;
    canvas: {x: number, y: number} = {x: 2000, y: 1000};
    velocity: {x: number, y: number} = {x: 0, y: 0};
    paddleHalfSize: number = 150;
    ballRadius: number = 30;
    now: Date = new Date();
    deltaTime: number;
    fps: number = 60;
    finishScore: number = 5;
    // finishScore: number = 1;
    winnerIndex: number = 0;
    gameBegin: boolean = false;

    async init() {
        await this.sleep(1000);
        this.setVelocity();
        this.resetBall(this.gameDelay);
        await this.beginGame();
    }

    setVelocity() {

    }

    async beginGame() {
        while (true) {
            this.now = new Date();
            this.deltaTime = this.now.getTime() - this.gameRoomDto.status.ballTime.getTime();

            this.moveBall();
            this.boundWall();
            this.boundPaddle();

            if (this.isEndGame()) break;
            if (this.callback) this.callback(this.gameRoomDto.status);

            await this.sleep(this.frameDelay);
        }
console.log('will call onComplete');
        if (this.onComplete) this.onComplete(this.getRoom(), this.winnerIndex);
    }

    setBeginForce() {
        this.gameBegin = true;
    }

    getRoom() {
        return this.gameRoomDto;
    }

    getPlay() {
        return this.gameRoomDto.status;
    }

    isEndGame() {
        if (this.finishScore <= this.gameRoomDto.status.score[0] ||
            (this.gameBegin && !this.gameRoomDto.playerSocketId[1])) {
            this.winnerIndex = 0;
            return true;
        }

        if (this.finishScore <= this.gameRoomDto.status.score[1] ||
            (this.gameBegin && !this.gameRoomDto.playerSocketId[0])) {
            this.winnerIndex = 1;
            return true;
        }

        return false;
    }

    public movePaddle(login: string, move: Move) {
        const index = this.gameRoomDto.status.player[0] === login ? 0 : 1;
        const beforePosition = this.gameRoomDto.status.paddlePosition[index];
        const beforeTime = new Date(this.gameRoomDto.status.paddleTime[index]);
        const nowTime = new Date();
        const timeSpan = (nowTime.getTime() - beforeTime.getTime()) / 1000;
        const beforeControl = this.gameRoomDto.status.control[index];

        if (beforeControl === Move.up) {
            const dir = -1;
            const offset = this.paddleSpeed * timeSpan * dir * this.fps;
            this.gameRoomDto.status.paddlePosition[index] = Math.max(beforePosition + offset, this.paddleHalfSize);
        }

        else if (beforeControl === Move.down) {
            const dir = 1;
            const offset = this.paddleSpeed * timeSpan * dir * this.fps;
            this.gameRoomDto.status.paddlePosition[index] = Math.min(beforePosition + offset, this.canvas.y - this.paddleHalfSize);
        }

        this.gameRoomDto.status.control[index] = move;
        this.gameRoomDto.status.paddleTime[index] = nowTime;
    }

    moveBall() {
        const ballTime = this.gameRoomDto.status.ballTime.getTime();
        const now = this.now.getTime();
        if (now < ballTime) return;

        this.gameBegin = true;
        this.gameRoomDto.status.ballPosition[0] += (this.deltaTime * this.velocity.x);
        this.gameRoomDto.status.ballPosition[1] += (this.deltaTime * this.velocity.y);
        this.gameRoomDto.status.ballTime = this.now;
    }

    boundPaddle() {
        if (this.isBoundPaddle()) {
console.log('is BOUND PADDLE is true!');
            return;
        }

        if (this.isGoal()) {
console.log('is GOAL is true!');
            return;
        }
    }

    isGoal(): boolean {
        const currentX = this.gameRoomDto.status.ballPosition[0];

        if (currentX < 0) {
            this.gameRoomDto.status.score[1] += 1;
        }
        else if (this.canvas.x < currentX) {
            this.gameRoomDto.status.score[0] += 1;
        }
        else {
            return false;
        }
        
        this.resetBall(this.resetDelay);
        return true;
    }

    isBoundPaddle(): boolean {
        const currentX = this.gameRoomDto.status.ballPosition[0];
        const currentY = this.gameRoomDto.status.ballPosition[1];
        const paddles = this.gameRoomDto.status.paddlePosition;
        let hitRatio = Infinity;
        let positive = false;

        if (currentX < this.ballRadius) {
            hitRatio = this.hitRatio(paddles[0], this.paddleHalfSize, currentY);
            positive = true;
        }
        else if (this.canvas.x - this.ballRadius < currentX) {
            hitRatio = this.hitRatio(paddles[1], this.paddleHalfSize, currentY);
            positive = false;
        }

        if (hitRatio === Infinity)
            return false;

        this.gameRoomDto.status.angle = hitRatio;
        this.velocity.x = Math.cos(this.gameRoomDto.status.angle) * this.ballSpeed;
        this.velocity.y = Math.sin(this.gameRoomDto.status.angle) * this.ballSpeed;
        this.velocity.x *= positive ? 1 : -1;
        return true;
    }

    hitRatio(source: number, wing: number, target: number): number {
        const positiveSpan = (source + wing) - target;
        const negativeSpan = target - (source - wing);
        const isHit = 0 < (positiveSpan * negativeSpan);

        if (!isHit) return Infinity;
        if (positiveSpan === negativeSpan) return 0;

        const ratio = (wing < positiveSpan) ?
                (negativeSpan / wing) - 1 :
                1 - (positiveSpan / wing);

        return ratio;
    }

    boundWall() {
        const currentY = this.gameRoomDto.status.ballPosition[1];
        if (this.canvas.y < currentY || currentY < 0) {
            this.velocity.y *= -1;
            this.gameRoomDto.status.ballPosition[1] *= -1;
        }

        while (this.gameRoomDto.status.ballPosition[1] < 0) {
            this.gameRoomDto.status.ballPosition[1] += this.canvas.y;
        }
    }

    resetBall(delay: number) {
        this.gameRoomDto.status.ballPosition[0] = 1000;
        this.gameRoomDto.status.ballPosition[1] = 500;
        this.gameRoomDto.status.angle = this.ballAngle();
        this.gameRoomDto.status.ballTime = new Date((this.now.getTime()) + (delay * 1000));
    }

    ballAngle(): number {
        const candidate = Math.PI * .25 * (Math.random() < .5? 1 : -1);
        const angle = candidate + (Math.random() < .5? Math.PI : 0);
        this.velocity.x = Math.cos(angle) * this.ballSpeed;
        this.velocity.y = Math.sin(angle) * this.ballSpeed;

        return angle;
    }

    async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
