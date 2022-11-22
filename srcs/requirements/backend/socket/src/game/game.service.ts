import { Injectable } from '@nestjs/common';

import { GamePlayDto } from 'src/dto/game.play.dto';
import { GameRoomDto } from 'src/dto/game.room.dto';
import { BusDto } from 'src/dto/bus.dto';
import { RoomType } from 'src/dto/enum';
// import { AppService } from 'src/app.service';

// import { Socket } from 'socket.io';
import { GameEntity } from 'src/entity/game.entity';
import { GameResult, Move } from 'src/config/struct';
// import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GameService {
    // constructor(
    //     private databaseService: DatabaseService,
    // ) {}
    // constructor() {}
        // const side = Math.ceil(Math.random() * 2);
        // const PI = 3.14159;

    private readonly roomType = [
        RoomType.private,
        RoomType.public,
        RoomType.protected,
    ]
    
    buildGameRoomDto(roomId: number, login: string[], playerSocketId: string[], speed: number): BusDto {
        const now = new Date();
        const status = {
            paddleTime: [now, now],
            roomId,
            player: login,
            ballPosition: [1000, 500],
            paddlePosition: [500, 500],
            control: [Move.release, Move.release],
            score: [0, 0],
            speed, // fps 60,
            // speed: 5 * 1000 / 300,
            angle: 1,
        } as GamePlayDto;

        return {
            result: true,
            value: {
                // invite,
                roomId: roomId,
                title: '[' + login[0] + '] VS [' + login[1] + ']',
                player: login,
                playerSocketId,
                observer: new Map<string, string>(),
                status,
            } as GameRoomDto
        } as BusDto;
    }

    buildGameEntity(login: string, enemy: string, roomId: number): GameEntity {
        const entity = new GameEntity();
        const date = new Date();
        entity.roomId = roomId;
        entity.login = login;
        entity.enemy = enemy;
        entity.result = GameResult.none;
        entity.begin = date;
        entity.end = date;

        return entity;
    }
}
