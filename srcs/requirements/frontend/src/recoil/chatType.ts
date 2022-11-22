import { IDetail } from "./socketType";

export class MessageDataDto {
  public readonly timeStamp: Date;

  constructor(
    //@IsDate() @IsNotEmpty()
    //public readonly timeStamp: Date = new Date(),
    //@IsString()
    public author?: string,
    //@IsString()
    public scope?: string,
    //@IsString() @IsNotEmpty()
    public content?: string,
    //@IsOptional() @IsObject()
    public option?: any,
  ) {
    this.timeStamp = new Date();
  }
}

export interface OptionDataDto {
  readonly title?:      string;
  readonly password?:   string;
  readonly duration?:   number;
}


export enum RoomType {
    protected = 'protected',
    private = 'private',
    public = 'public',
}

export class ChatRoom{
  public readonly createAt: Date;

constructor(
  //@IsDate() @IsNotEmpty()
  //public readonly createAt: Date = new Date(),
  //@IsNumber()
  public readonly roomId: string,//number,
  //@IsString() @IsNotEmpty() @Length(1, 20)
  public title: string,
  //@IsEnum(RoomType)
  public roomType: RoomType,
  //@IsString() @ValidateIf(o => o.roomType !== RoomType.public) @IsNotEmpty() @Length(4, 8)
  public password?: string,
  //* params: login: <string>, login: <string> @IsNotEmpty()
  //public owner: Map<string, string> = new Map<string, string>(),  // login, login
  //go different way from ChatRoomDto
  public member: Map<string, IDetail> = new Map<string, IDetail>(), // socket.id, socket.id
  //* params: login: <string>, count: <number> @IsNotEmpty()
  public dupMember: Map<string, number> = new Map<string, number>(), // login, count
  //* params: login: <string>, login: <string> @IsString()
  public invite: Map<string, string> = new Map<string, string>(), // login, login
  //* params: login: <string>, login: <string> @IsString()
  public banUser: Map<string, string> = new Map<string, string>(), // login, login
  //* params: login: <string>, finishTime: <number> @IsObject()
  public mute: Map<string, number> = new Map<string, number>(), // login, finishTime
  public message: MessageDataDto[] = [],
) {
  this.createAt = new Date();
}

}




// export interface Message {
//   roomId?:     string;
//   timeStamp?:  string;
//   author:      string;
//   content:     string;
// };


// export interface MessageDataDto {
//   readonly timeStamp: Date;
//   readonly author?: string;
//   readonly scope?: string;
//   readonly content?: string;
//   readonly option?: any;
// }


// export interface ChatRoom  {
//   readonly  id:         string;
//             title?:      string;
//             type?:       RoomType.protected | RoomType.public | RoomType.private;
//           //type?:       string; //'private' | 'public' | 'protected';
//           //password?:  string;
//             messages?:   Message[]; //change back to MessageDataDto
//             members?:     string[];
// }

// export class ChatRoom  {
//   constructor(
//     public readonly  roomId:      string,
//     public           title:      string= "hello",
//     public           roomType?:  RoomType.protected | RoomType.public | RoomType.private,
//     public           password?:  string,
//     public           message?:   MessageDataDto[], //change back to MessageDataDto
//     public           member?:     string[],
//   ) {}
// }

