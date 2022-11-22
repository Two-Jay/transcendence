import { ChatRoom } from './chatType';
import { atom, selector, selectorFamily } from "recoil";

// import { recoilPersist } from 'recoil-persist'

// const { persistAtom } = recoilPersist({
//   key: 'persistChatRoomMapAtom',
//   //storage: localStorage,
// })

export const chatRoomMapAtom = atom<Map<string, ChatRoom>>({
  key: "chatRoomMapAtom",
  default: selector<Map<string, ChatRoom>>({
    key: "chatRoomMapLoader",
    get: () => {
      const chatRoomMap = new Map<string, ChatRoom>();
      return chatRoomMap;
    },
  }),
  //effects_UNSTABLE: [persistAtom],
});

export const chatSelector = selectorFamily({
  key: "chatSelector",
  // this is return the specific messages when given it's roomId
  get: (key: string) => ({ get }) => {
    const chatRoomMap = get(chatRoomMapAtom) as Map<string, ChatRoom>;
    if (chatRoomMap == null || !(chatRoomMap instanceof Map)) return undefined;
    if (!chatRoomMap.has(key)) return undefined;
    return chatRoomMap.get(key);
  },

  cachePolicy_UNSTABLE: {
    eviction: "most-recent",
    //eviction: "lru", maxSize: 10000,
  },
});

export const currentChatRoomIdAtom = atom<string>({
  key: 'currentChatRoomIdAtom',
  default: ""
});

export const selectedUserAtom = atom<string>({
  key: 'selectedUserAtom',
  default: ""
});

// export const currentChatRoomAtom = atom<ChatRoom>({
//   key: "currentChatRoomAtom",
//   default: undefined,
// });





// export const chatRoomsAtom = atom<ChatRoom[]>({
//   key: "chatRoomsAtom",
//   default: [],
// });

/*
export const updateChatRoomsSelector = selector ({
  key: "updateChatRoomsSelector",
  // this is return the specific messages when given it's roomId
  get: ({ get }) => get(chatRoomsAtom),

  set: ({get, set}, newValue) => {
//console.log('> from server111 <', newValue);
    if (newValue instanceof DefaultValue) return;
    if (typeof newValue !== "object") return;
    if (newValue == null) return; //undefined + null

    const val = newValue as any;
    const vType = val.type;

    if (vType === 'create') {
      const addRooms = val.rooms as ChatRoom[];
      set(chatRoomsAtom, (curRooms)=> {
        console.log("create", curRooms.length, addRooms.length);
        const newRooms = [...curRooms] as ChatRoom[];
        let i = 0;
        addRooms.map((aroom)=>{{
          if (curRooms.find((cRoom) => cRoom.id === aroom.id) === undefined) {
            newRooms.push({...aroom});//, messages:[] });
            i++;
          }
        }});
        console.log("created", i);
        return (newRooms);
      });
    } //end of if create

    else if(vType === 'delete') {
      const removeRoomIds = val.roomIds as string[];
      set(chatRoomsAtom, (curRooms)=> {
        console.log("delete", curRooms.length, removeRoomIds.length);
        const newRooms = curRooms.filter(croom=>!removeRoomIds.includes(croom.id));
        console.log("deleted", curRooms.length - newRooms.length);
        return newRooms;
      });
    } //end of else if delete

    else if (vType === 'change' || vType === 'add' || vType === 'remove') {


      set(chatRoomsAtom, (curRooms)=> {
        const newRooms = [...curRooms].map((croom)=> {
          const vRoomId = val.roomId;

          if (croom.id === vRoomId) {

            let nroom = {...croom} as any;
            Object.keys(val).forEach(key => {
              const value = val[key];
              if (key === "type" || key === "roomId")
                return;

              if (vType === 'change') {
                const idx = Object.keys(nroom).findIndex((nkey)=>nkey===key);
                const nvalue = Object.values(nroom)[idx] as any;
                console.log("update change", key, nvalue, value);
                nroom = {...nroom, [key]: value}

              } else if (vType === 'add') {
                const idx = Object.keys(nroom).findIndex((nkey)=>nkey===key);
                if (idx === -1) {
                  console.log("update add as new", key, value);
                  nroom = {...nroom, [key]: [...value]};
                  return;
                }
                const nvalue = Object.values(nroom)[idx] || undefined as any;
                console.log("update add", key, value);
                nroom = {...nroom, [key]: [...nvalue, ...value] || [...value]}
              } else if (vType === 'remove') {
                //use filter
                console.log("remove===", value)
                const idx = Object.keys(nroom).findIndex((nkey)=>nkey===key);
                if (idx == -1) {
                  console.log("cannot find the key", key, ", so nothing changed")
                }
                //let nvalue = Object.values(nroom)[idx] || undefined;
                let nvalue: string[] = Object.values<string[]>(nroom)[idx] || [];
                nvalue = nvalue.filter(val=>!value.includes(val));
                nroom = {...nroom, [key]: [...nvalue]}
              }
            })
            return nroom;
          } else return croom;
        });
        return (newRooms);
      }); //end of else if update (change and add)

    }

  },
});

// selector Family
export const chatSelector = selectorFamily({
  key: "chatSelector",
  // this is return the specific messages when given it's roomId
  get: (id: string) => ({ get }) => get(chatRoomsAtom).find(r=>r.id===id),

  //not working? update by using updateRoomsSelector
  set: (id: string) => ({set}, newValue) => {
    set(chatSelector(id), newValue);
  },
  cachePolicy_UNSTABLE: {
    eviction: "most-recent",
    //eviction: "lru", maxSize: 10000,
  },
});


// selector Family not working yet
// not working yet
// not working yet
export const addMsgToRoomSelector = selectorFamily({
  key: "addMsgToRoomSelector",
  // this is return the specific messages when given it's roomId
  get: (id: string) => ({ get }) => get(chatRoomsAtom).find(r=>r.id===id),

  //with 2nd try not working
  set: (id: string) => ({set}, newValue) => {


    console.log("set", newValue);
    if (newValue instanceof DefaultValue) return;
    if (newValue === undefined) return;
    if (newValue == null) return;
    if (typeof newValue !== "object") return;

    console.log("000inside the selector setter")


    //2.3
    set(chatSelector(id) as RecoilState<ChatRoom>, (croom)=>{

      console.log("111", croom.id);

      const val = newValue as any;
      const msg = val.message as Message;
      const cmessages = croom.messages as Message[];
      return {...croom, messages: [...cmessages, msg] || [msg]};
    });
  },


  cachePolicy_UNSTABLE: {
    eviction: "most-recent",
    //eviction: "lru", maxSize: 10000,

  },

});

*/
