import { atom } from "recoil";
import { nanoid } from 'nanoid';


export const socketConnectedAtom = atom<boolean>({
  key: 'socketConnectedAtom',
  default: false,
  // default: selector({
  //   key: 'socketConnectedLoader',
  //   get: ()=>{return false;},

  //   // get: async() => {
  //   //   return socket.connected;
  //   // },
  //   cachePolicy_UNSTABLE: {
  //     eviction: "most-recent",
  //   },
  // }),
});



export const socketWelcomeKitAtom = atom({
  key: 'socketWelcomeKitAtom',
  default: null,
})


// export interface User {
//   readonly  login:        string;
//             nickname:     string;
//             online:       boolean;
//             joinedRooms:  string[]; //room_id or login

// }

// export interface Me  {
//             profile:      User;
//             friends:      User[];
//             blocks:       User[];
//             chats:        Room[];
//             games:        Game[];
// }

export const avatarChangeVisitCountAtom = atom({
  key: `avatarChangeVisitCountAtom/${nanoid()}}`,
  default: 0,
})

export const chatUserListVisitCountAtom = atom({
  key: `chatUserListVisitCountAtom/${nanoid()}}`,
  default: 0,
})
