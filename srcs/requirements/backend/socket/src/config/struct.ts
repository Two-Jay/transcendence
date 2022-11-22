export interface IDetail {
  login: string;
  nickname: string;
  avatar: string;
  isOnline: boolean;
  isFriend?: boolean;
  isBlock?: boolean;
  isAdmin?: boolean;
  isOwner?: boolean;

  matchHistory: any[]; // max size 5
  ladder: number;
  gameRatio: { win: number, lose: number }
}

export interface IPair {
  key: string;
  value: string;
}

// export interface IHistory {
//   score: number[]; // size 2 (fixed)
//   result: GameResult;
// }

export enum Ladder {
  'novice' = 0,
  'expert' = 1,
  'master' = 2,
}

// export enum LadderScore {
//   'novice' = 0,
//   'expert' = 1,
//   'master' = 2,
//   // 'novice' = 9,
//   // 'expert' = 19,
//   // 'master' = 29,
// }

export enum GameResult {
  'none',
  'win',
  'tie',
  'lose',
}

export enum Relation {
  'none' = 0,
  'friend' = 1,
  'block' = 2,
  'friendBlock' = 3,
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

export class TokenData {
  public login: string;
  public validate: boolean;
}
