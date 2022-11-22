import { GameRoomDto } from "./gameType";
import { Ladder, LadderGrade } from "./socketType";

export const isJoined = (login: string, game: GameRoomDto) => {
  let joined: boolean;
  if (isJoinedPlayer(login, game) || isObserver (login, game)) {
    console.log("===game joined===", isJoinedPlayer(login, game), isObserver (login, game))
    joined = true;
  } else {
    joined = false;
  }
    return joined;
};

export const isPlayer = (login: string, game: GameRoomDto) => {
  let isPlayer: boolean;
  const player = game?.player;
  if(game == undefined || player == undefined || player.length < 1)
    isPlayer = false;
  else
    isPlayer  = game.player.find((p) => p === login)? true : false ;
  return isPlayer;
};

export const isJoinedPlayer = (login: string, game: GameRoomDto) => {
  const players = game?.player;
  const playerSocketIds = game?.playerSocketId;

  if (!isPlayer(login, game)) return false;

  const idx = players.indexOf(login);
  if (playerSocketIds[idx] == null) return false;
  return true;

};



export const isObserver = (login: string, game: GameRoomDto) => {
  let isObserver: boolean;
  const observer = game?.observer;
  if(game == null || observer == null || !(observer instanceof Map) || observer.size < 1)
    isObserver = false;
  else
    isObserver = observer.has(login);
  return isObserver;
};

export const getLadderGrade = (ladder : number) => {

  let ladderGrade;

  if (ladder <= LadderGrade.novice)
    ladderGrade = Ladder.novice;
  else if (ladder <= LadderGrade.expert)
    ladderGrade = Ladder.expert
  else
    ladderGrade = Ladder.master;

  return Object.keys(Ladder)[Object.values(Ladder).indexOf(ladderGrade)]
}






// export const printGamePlayDto = (msg: any) => {
//   console.log('from server000 printGamePlayDto', msg);
// }


// export const printGameRoomDto = (msg: GameRoomDto) => {
//   console.log('from server000 printGameRoomDto', msg);
// }
