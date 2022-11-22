import { IsEnum, Length, ValidateIf, IsObject, IsDate, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { RoomType } from 'src/dto/enum';
import { Socket } from 'socket.io';

export class ChatRoomDto {
  @IsDate()
  @IsNotEmpty()
  public readonly createAt: Date = new Date();

  @IsNumber()
  public readonly roomId: number;

  @IsEnum(RoomType)
  public roomType: RoomType;

  @IsNumber()
  @ValidateIf(o => o.roomType !== RoomType.public)
  @IsNotEmpty()
  @Length(4, 4)
  public password: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  public title: string;

  /**
   * params: login: <string>, login: <string>
   */
   @IsNotEmpty()
  public admin: Map<string, string>;  // login, login

  @IsNotEmpty()
  public owner: string;

  /**
   * params: socket.id: <string>, socket.id: <string>
   */
  @IsNotEmpty()
  public member: Map<string, string>; // socket.id, socket.id

  /**
   * params: login: <string>, count: <number>
   */
   @IsNotEmpty()
  public dupMember: Map<string, number>; // login, count

  /**
   * params: login: <string>, login: <string>
   */
   @IsString()
  public invite: Map<string, string>; // login, login

  /**
   * params: login: <string>, login: <string>
   */
  @IsString()
  public banUser: Map<string, string>; // login, login

  /**
   * params: login: <string>, finishTime: <number>
   */
   @IsObject()
  public mute: Map<string, number>; // login, finishTime
}
