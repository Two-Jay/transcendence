import { GameRoomDto } from './gameType';
import { ChatRoom } from './chatType';

/*
whoamiDetail
friend list
block list
chatroom list
  const rooms: {
      id: number;
      title: string;
      type: RoomType.protected | RoomType.public;
  }[]
onGame
  const onGame: {
      roomId: number;
      pair: string[];
  } | undefined
*/


export interface WelcomeKit  {
  readonly  users:    IDetail[];
  readonly  rooms:      ChatRoom[];
  readonly  game:       GameRoomDto[];
}


export interface IDetail {
  login: string;
  nickname: string;
  avatar: string;
  isOnline: boolean;
  isFriend?: boolean;
  isBlock?: boolean;
  isAdmin?: boolean;
  isOwner?: boolean;
  matchHistory: IHistory[]; // max size 5
  ladder: Ladder;
  gameRatio: { win: number, lose: number }

}



export interface IDetail0 {
  login: string;
  nickname: string;
  avatar: string;
  isOnline: boolean;
  isFriend?: boolean;
  isBlock?: boolean;
  isAdmin?: boolean;
  matchHistory: any[]; // max size 5
  ladder: number;
  gameRatio: { win: number, lose: number }
}


export interface IHistory {
  enemy: string;
  score?: number[]; // size 2 (fixed)
  result: GameResult;
  begin?: string;
  end?: string;
}

export enum LadderGrade {
  'novice' = 2,
  'expert' = 4,
  'master' = 6,
}

export enum Ladder {
  'novice' = 0,
  'expert' = 1,
  'master' = 2,

}

export enum GameResult {
  'none',
  'win',
  'tie',
  'lose',
}

export enum Move {
  'down' = -1,
  'release',
  'up',
}

export enum GameMode {
  'normal' = 1,
  'speedy' = 3,
}

