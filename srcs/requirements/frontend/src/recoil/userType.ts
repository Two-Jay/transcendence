import { IDetail, IHistory, Ladder } from "./socketType";

export const postFriendApiUrl = "/sapi/auth/friend";
export const postBlockApiUrl = "/sapi/auth/block";

export const postWhoisfriendApiUrl = "/sapi/auth/whoisfriend";
export const postWhoisblockApiUrl = "/sapi/auth/whoisblock";

interface IUser extends IDetail {
  avatarImgSrc? : string;
}

export class User implements IUser {
  public readonly timeStamp: Date;

  constructor(
    //@IsDate() @IsNotEmpty()
    //public readonly timeStamp: Date = new Date(),
    //@IsString()
    public login: string,
    //@IsString()
    public nickname: string,
    //@IsString() @IsNotEmpty()
    public avatar: string,
    //@IsOptional() @IsObject()
    public isOnline: boolean,
    public isFriend: boolean = false,
    public isBlock: boolean = false,
    public isAdmin: boolean = false,
    public isOwner: boolean = false,
    public matchHistory: IHistory[], // max size 5
    public ladder: Ladder = Ladder.novice,
    public gameRatio: { win: number, lose: number },
    public avatarImgSrc?: string,

  ) {
    this.timeStamp = new Date();
  }
}


