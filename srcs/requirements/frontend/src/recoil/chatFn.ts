import { ChatRoom } from "./chatType";

export const isJoined = (login: string, chat: ChatRoom) => {
  let joined: boolean;

  const member = chat?.member;

  if(chat == null || member == null || !(member instanceof Map) || member.size < 1)
    joined = false;
  else
    joined  = member.has(login);
  return joined;
};


export const isAdmin = (login: string, chat: ChatRoom) => {
  let ret: boolean;

  let joined = isJoined(login, chat);
  if (!joined) return false;

  const memberMap = chat?.member;

  if(chat == undefined || memberMap == null || memberMap.size < 1)
    return false;
  else {
    const member  = memberMap.get(login);
    if (member == null) return  false;
    if (member.isAdmin) return true;
    else ret = false;
  }
  return ret;
};

export const isOwner = (login: string, chat: ChatRoom) => {
  let ret: boolean;

  let joined = isJoined(login, chat);
  if (!joined) return false;

  const memberMap = chat?.member;

  if(chat == undefined || memberMap == null || memberMap.size < 1)
    return false;
  else {
    const member  = memberMap.get(login);
    if (member == null) return  false;
    if (member.isOwner) return true;
    else ret = false;
  }
  return ret;
};


// export const printMsgDataDto = (msg: MessageDataDto) => {
//   console.log('from server000 printMsgDataDto', msg);
// }
