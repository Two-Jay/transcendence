

export class GamePlayDto {

  public paddleTime: Date[];
  public ballTime: Date;

constructor(
  readonly roomId: number,// = 0;
  readonly player: string[] = [],
  readonly paddlePosition: number[] = [500, 500],// = []; // [x | y] * 1000 // normalized player1, player2
  readonly ballPosition?: number[],// = []; // [x, y] * 1000 // normalized
  public score?: number[],
  readonly speed?: number,// = 0; // 1 ~ 1000 or fixed number?
  readonly angle?: number,// = 0; // 0 ~ Math.PI * 1000 // exclude 0, Math.PI * 1000
  public author?: string,
  ){

  const now = new Date();
  this.paddleTime = [now, now];
  this.ballTime = now;
}

}

export class GameRoomDto {
  public readonly createAt: Date;

constructor(
  public readonly roomId: number,
  public title: string,
  public player: string[] = [],
  public status: GamePlayDto = new GamePlayDto(roomId, player),
  // public status: GamePlayDto,
  public playerSocketId: string[] = [],
  public observer: Map<string, string> = new Map(), // socket.id, Socket
  public observerCount: number = 0,
  public readonly invite?: string,
  public banUser: Map<string, string> = new Map(), // login, login
  public score: number[] = [],
){
  this.createAt = new Date();
}

}



/*
export interface GameRoomDto1 {
  readonly  createAt:       Date; //string// = new Date();
  readonly  invite?:        string;
  readonly  roomId:        number;
            title?:          string;
            observer?:      string[];
            player?:        string[];
            score?:         number[];
            status?:        GamePlayDto;
}

export interface GamePlayDto1 {
  readonly  timeStamp:      Date;
  author?: string;
  readonly  roomId:         number;
  readonly  paddlePosition?: number[]; // [y, y] * 1000 // normalized player1, player2
  readonly  ballPosition?:   number[]; // [x, y] * 1000 // normalized
  readonly  speed?:          number; // 100 ~ 1000 or fixed number?
  readonly  angle?:          number; // 0 ~ Math.PI * 1000 // exclude 0, Math.PI * 1000
}

export interface PlayInfo {
            roomId?:        number;
            timeStamp?:     Date;
            author:         string;
            paddlePosition: number[]; // [y, y] * 1000 // normalized player1, player2
            ballPosition?:  number[]; // [x, y] * 1000 // normalized
            speed?:         number;   // 100 ~ 1000 or fixed number?
            angle?:         number;   // 0 ~ Math.PI * 1000 // exclude 0, Math.PI * 1000
            score?:         number[]; // add?
          };
*/


          /*
export interface Game  {
  readonly  id:         number;
            title?:     string;
            player?:   string[]; //only two, players are members too?
            //members?:   string[]; //Member interface?
            playinfo?:  PlayInfo; //1 is enough or n? []
}
*/
export interface Duel {
            fromId:       string;
            toId:         string;
            timeStamp?:   Date;
            request?:     boolean;
            beRequested?: boolean;
            accepted?:    boolean;
            rejected?:    boolean;
            gameReady?:   boolean;
            roomId?:      number;
}

export interface Match {
  request: boolean;
  roomId?: number;
}

