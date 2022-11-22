import { nanoid } from 'nanoid';
import { Duel, GameRoomDto, Match } from './gameType';
import { atom, selector, selectorFamily } from "recoil";


export const gameMapAtom = atom<Map<number, GameRoomDto>>({
  key: "gameMapAtom",
  default: selector<Map<number, GameRoomDto>>({
    key: "gameMapLoader",
    get: () => {
      const gameMap = new Map<number, GameRoomDto>();
      return gameMap;
    }
  }),
});

export const gameSelector = selectorFamily({
  key: "gameSelector",
  // this is return the specific messages when given it's roomId
  get: (key: number) => ({ get }) => {
    const gameMap = get(gameMapAtom) as Map<number, GameRoomDto>;
    if (gameMap == null || !(gameMap instanceof Map)) return undefined;
    if (!gameMap.has(key)) return undefined;
    return gameMap.get(key);
  },

  cachePolicy_UNSTABLE: {
    eviction: "most-recent",
    //eviction: "lru", maxSize: 10000,
  },
});

export const currentGameRoomIdAtom = atom<number>({ //number
  key: 'currentGameRoomIdAtom',
  default: 0
});


export const onGameToastAtom = atom<boolean>({ //number
  key: `onGameToastAtom/${nanoid()}`,
  default: false
});


export const ballSpeedAtom = atom<number>({
  key: 'ballSpeedAtom',
  default: 1,
});

export const matchAtom = atom<Match>({
  key: "matchAtom",
  default: {
    request: false,
    roomId: 0,
  }
})

export const duelAtom = atom<Duel>({
  key: "duelAtom",
  default: {
    fromId: "",
    toId: "",
    request:     false,
    beRequested: false,
    accepted:    false,
    rejected:    false,
    gameReady:   false,
    roomId:      0,
  },
});

/*
export const updateGamesSelector = selector ({
  key: "updateGamesSelector",
  // this is return the specific messages when given it's roomId
  get: ({ get }) => get(gamesAtom),

  set: ({get, set}, newValue) => {
    //console.log('> from server111 <', newValue.paddlePosition);

    if (newValue instanceof DefaultValue) return;
    if (typeof newValue !== "object") return;
    if (newValue == null) return; //undefined + null

    const val = newValue as any;
    const vType = val.type;

    if (vType === 'create') {
      const addGames = val.games as GameRoomDto[];
      set(gamesAtom, (curGames)=> {
        console.log("create", curGames.length, addGames.length);
        const newGames = [...curGames];
        let i = 0;
        addGames.map((agame)=>{{
          if (curGames.find((cGame) => cGame.roomId === agame.roomId) === undefined) {
            newGames.push({...agame});//, messages:[] });
            i++;
          }
        }});
        console.log("created", i);
        return (newGames);
      });
    } //end of if create

    else if(vType === 'delete') {
      const removeRoomIds = val.roomIds as number[];
      set(gamesAtom, (curGames)=> {
        console.log("delete", curGames.length, removeRoomIds.length);
        const newRooms = curGames.filter(cgame=>!removeRoomIds.includes(cgame.roomId));
        console.log("deleted", curGames.length - newRooms.length);
        return newRooms;
      });
    } //end of else if delete

    else if (vType === 'change' || vType === 'add') {
      set(gamesAtom, (curGames)=> {
        const newGames = [...curGames].map((cgame)=> {
          const vRoomId = val.roomId;
          if (cgame.roomId === vRoomId) {

            let ngame= {...cgame} as any;
            Object.keys(val).forEach(key => {
              const value = val[key];
              if (key === "type" || key === "roomId")
                return;

              console.log("===", key, value);

              if (vType === 'change') {
                const idx = Object.keys(ngame).findIndex((nkey)=>nkey===key);
                const nvalue = Object.values(ngame)[idx] as any;
                console.log("update change", key, nvalue, value);
                ngame = {...ngame, [key]: value}

              } else if (vType === 'add') {
                const idx = Object.keys(ngame).findIndex((nkey)=>nkey===key);
                if (idx === -1) {
                  console.log("update add as new", key, value);
                  ngame = {...ngame, [key]: [...value]};
                  return;
                }
                const nvalue = Object.values(ngame)[idx] || undefined as any;
                console.log("update add", key, value);
                ngame = {...ngame, [key]: [...nvalue, ...value] || [...value]}
              } else if (vType === 'remove') {
                //use filter
              }

            })
            return ngame;
          } else return cgame;
        });
        return (newGames);
      }); //end of else if update (change and add)

    }

  },
});

*/


