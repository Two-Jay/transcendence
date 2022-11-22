import { IsObject, IsNotEmpty, IsDate, IsString, IsNumber } from 'class-validator';
import { GamePlayDto } from 'src/dto/game.play.dto';
import { Socket } from 'socket.io';

export class GameRoomDto {
    @IsDate()
    @IsNotEmpty()
    public readonly createAt: Date = new Date();

    // /**
    //   * params: login: <string>
    //   */
    // @IsString()
    // public readonly invite?: string; // login

    /**
      * params: roomId: <number>
      */
    @IsNumber()
    public readonly roomId: number;
  
    /**
      * params: title: <string>
      */
    @IsString()
    @IsNotEmpty()
    public title: string;
  
    /**
      * params: socketId: <string[2]>
      */
    @IsString()
    @IsNotEmpty()
    public playerSocketId: string[];
  
    /**
      * params: login: <string[2]>
      */
    @IsString()
    @IsNotEmpty()
    public player: string[];

    /**
      * params: socket.id: <string>, socket.id: <string>
      */
    @IsNotEmpty()
    public observer: Map<string, string>; // socket.id, Socket.id

    @IsNumber()
    public observerCount: number = 0;

    // /**
    //   * params: login: <string>, login: <string>
    //   */
    // @IsNotEmpty()
    // public banUser: Map<string, string>; // login, login

    /**
      * params: gamePlayDto: <GamePlayDto>
      */
    @IsObject()
    @IsNotEmpty()
    public status: GamePlayDto;
}
