import { postAvatarDownloadQuery } from './avatarState';
import { ChatRoom, MessageDataDto } from "./chatType";
import { GameRoomDto } from './gameType';
import { IDetail } from './socketType';
import { postWhoisblockQuery, postWhoisfriendQuery } from './userState';
import { User } from "./userType";

export class MapUtils {

  static toArray<TKey, TValue>(map: Map<TKey, TValue>) : Array<TValue> {
    if (!(map instanceof Map)) return [];
     return Array.from(map.values()).filter(val=> val != null);
  }

  static set<TKey, TValue>(curMap: Map<TKey, TValue>, key: TKey, value: TValue): Map<TKey, TValue> {
    const newMap: Map<TKey, TValue> = new Map<TKey, TValue>(curMap);
    newMap.set(key, value);
    return newMap;
  }

  static delete<TKey, TValue>(curMap: Map<TKey, TValue>, key: TKey): Map<TKey, TValue> {
    const newMap: Map<TKey, TValue> = new Map<TKey, TValue>(curMap);
    newMap.delete(key);
    return newMap;
  }

  static filter<TKey, TValue>(curMap: Map<TKey, TValue>, filterFunction: (key: TKey, value: TValue) => boolean): Map<TKey, TValue> {
    if (curMap.size === 0) return curMap;
    const filteredMap: Map<TKey, TValue> = new Map<TKey, TValue>();

    curMap.forEach((value, key) => {
      if (filterFunction(key, value)) {
        filteredMap.set(key, value);
      }
    });
    return filteredMap;
  }

  static clear<TKey, TValue>(curMap: Map<TKey, TValue>): Map<TKey, TValue> {
    const newMap: Map<TKey, TValue> = new Map<TKey, TValue>(curMap);
    newMap.clear();
    return newMap;
  }

}


//to deal with attributes inside map
export class UserMapUtils extends MapUtils {

  //add chatrooms to the map from ChatRoom[]
  static sets(curMap: Map<string, User>, users: User[]): Map<string, User> {
    const newMap = new Map<string, User>(curMap);

    //users.map(user=>newMap.set(user.login, user));
    users.map(user => {
      if (user != null) {
        newMap.set(user.login, user);
      }
    })
    return newMap;
  }

  static async sets2(curMap: Map<string, User>) {
    const newMap = new Map<string, User>(curMap);

    const users = MapUtils.toArray(curMap) as User[];
    //console.log("---users---", curMap.size, users.length);
    for await (const user of users) {
      if (user == null) return;
      const newUser = {...user} as User;
    //add more//
      newUser.avatarImgSrc = newUser.avatar ? await postAvatarDownloadQuery(newUser.avatar as string, 128) : "";
      newUser.isFriend  =  await postWhoisfriendQuery(newUser.login);
      newUser.isBlock = await postWhoisblockQuery(newUser.login);
      //console.log("in sets2", newUser.isFriend, newUser.isBlock)
      if (newMap.has(user.login))
        newMap.set(newUser.login, newUser);
    }
    //console.log("new2======", newMap.size)

    return newMap;
  }

  static async set2(curMap: Map<string, User>, user: User) {
    const newMap = new Map<string, User>(curMap);

    if (user == null) return curMap;
    const newUser = {...user} as User;
    //add more//
    //console.log("newUser in set2", newUser)
    newUser.avatarImgSrc = newUser.avatar ? await postAvatarDownloadQuery(newUser.avatar as string, 128) : "";
    newUser.isFriend  =  await postWhoisfriendQuery(newUser.login);
    newUser.isBlock = await postWhoisblockQuery(newUser.login);
    //console.log("in set2", newUser.isFriend, newUser.isBlock)
    newMap.set(newUser.login, newUser);
    return newMap;
  }

}

//to deal with attributes inside map
export class ChatMapUtils extends MapUtils {

  //add chatrooms to the map from ChatRoom[]
  static sets(curMap: Map<string, ChatRoom>, chats: ChatRoom[]): Map<string, ChatRoom> {
    const newMap = new Map<string, ChatRoom>(curMap);
    //newMap.clear();
    chats.map(chat => {
      if (!newMap.has(chat.roomId))
        newMap.set(chat.roomId, chat);
    });
    return newMap;
  }

  //change attribute inside the map
  static set_attr(curMap: Map<string, ChatRoom>, chatRoomId: string, key: string, value: any): Map<string, ChatRoom> {
    const newMap = new Map<string, ChatRoom>(curMap);
    if (!newMap.has(chatRoomId)) return curMap;
    const curChat = newMap.get(chatRoomId) as ChatRoom;
    if (!Object.keys(curChat).find(k=> k=== key)) {
      console.log("===ChatMapUtils.set_attr, can not find", key);
      return curMap;
    }
    const newChat = {...curChat, [key]: value} as ChatRoom;
    newMap.set(newChat.roomId, newChat);
    return newMap;
  }

  //from IDetail[] set Map<string, IDetail>
  static set_members(curMap: Map<string, ChatRoom>, chatRoomId: string, membersDetail: IDetail[]): Map<string, ChatRoom> {
    const newMap = new Map(curMap);
    if (!newMap.has(chatRoomId)) return curMap;
    const curChat = newMap.get(chatRoomId);

    const newMember = new Map();
    membersDetail.map(mDetail => {
      newMember.set(mDetail.login, mDetail);
    });

    const newChat = {...curChat, member: newMember} as ChatRoom;
    newMap.set(newChat.roomId, newChat);

    return newMap;
  }


  //change new message to Message[] inside the map
  static add_msg(curMap: Map<string, ChatRoom>, chatRoomId: string, newMessages: MessageDataDto[]): Map<string, ChatRoom> {
    const newMap = new Map(curMap);
    if (!newMap.has(chatRoomId)) return curMap;
    const curChat = newMap.get(chatRoomId) as ChatRoom;

    const curMessages = curChat?.message || [] as MessageDataDto[];
    const newChat = {...curChat, message: [...curMessages, ...newMessages] || [...newMessages]} as ChatRoom;
    newMap.set(newChat.roomId, newChat);
    return newMap;
  }

  /*
  static add_owner(curMap: Map<string, ChatRoom>, chatRoomId: string, login: string): Map<string, ChatRoom> {
    const newMap = new Map(curMap);
    if (!newMap.has(chatRoomId)) return curMap;
    const curChat = newMap.get(chatRoomId);

    const newOwner = new Map(curChat?.owner);
    newOwner.set(login, login);

    console.log("====owner===", newOwner.keys());

    const newChat = {...curChat, owner: newOwner} as ChatRoom;
    newMap.set(newChat.roomId, newChat);
    return newMap;
  }
  */
}


export class GameMapUtils extends MapUtils {

  //add chatrooms to the map from ChatRoom[]
  static sets(curMap: Map<number, GameRoomDto>, games: GameRoomDto[]): Map<number, GameRoomDto> {
    const newMap = new Map<number, GameRoomDto>(curMap);
    //newMap.clear();
    games.map(game => {
      if (!newMap.has(game.roomId))
        newMap.set(game.roomId, game);
    });
    return newMap;
  }


  //change attribute inside the map
  static set_attr(curMap: Map<number, GameRoomDto>, gameRoomId: number, key: string, value: any): Map<number, GameRoomDto> {
    const newMap = new Map<number, GameRoomDto>(curMap);
    if (!newMap.has(gameRoomId)) return curMap;
    const curGame = newMap.get(gameRoomId) as GameRoomDto;
    if (!Object.keys(curGame).find(k=> k=== key)) {
      console.log("===GameMapUtils.set_attr, can not find", key);
      return curMap;
    }

    const newGame = {...curGame, [key]: value} as GameRoomDto;
    newMap.set(newGame.roomId, newGame);
    return newMap;
  }

}




/*
chatmap

  static add_members(curMap: Map<string, ChatRoom>, chatRoomId: string, membersDetail: IDetail[]): Map<string, ChatRoom> {
    const newMap = new Map(curMap);
    if (!newMap.has(chatRoomId)) return curMap;
    const curChat = newMap.get(chatRoomId);

    const newMember = new Map(curChat?.member);

    if (membersDetail.length == 0) {
      newMember.clear();
    } else {
      membersDetail.map(mDetail=> {
        newMember.set(mDetail.login, mDetail);
      });
  }

    const newChat = {...curChat, member: newMember} as ChatRoom;
    newMap.set(newChat.roomId, newChat);

    return newMap;
  }

  static remove_members(curMap: Map<string, ChatRoom>, chatRoomId: string, membersDetail: IDetail[]): Map<string, ChatRoom> {
    const newMap = new Map(curMap);
    if (!newMap.has(chatRoomId)) return curMap;
    const curChat = newMap.get(chatRoomId);

    const newMember = new Map();

    if (membersDetail.length == 0) {
      newMember.clear();
    } else {
      membersDetail.map(mDetail => {
        newMember.delete(mDetail.login);
      });
    }

    const newChat = {...curChat, member: newMember} as ChatRoom;
    newMap.set(newChat.roomId, newChat);

    return newMap;
  }



*/
