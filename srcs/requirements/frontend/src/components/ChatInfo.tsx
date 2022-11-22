import {RecoilState, useRecoilValue } from "recoil";
import { isJoined } from "../recoil/chatFn";
import { currentChatRoomIdAtom, chatSelector } from "../recoil/chatState";
import {ChatRoom  } from "../recoil/chatType";
import { whoamiAtom } from "../recoil/whoamiState";
import ChatList from "./ChatList";
import CUserList from "./CUserList";

const ChatInfo: React.FC = () => {

  const whoami = useRecoilValue(whoamiAtom);
  const chatRoomId = useRecoilValue(currentChatRoomIdAtom);
  const chat = useRecoilValue(chatSelector(chatRoomId) as RecoilState<ChatRoom>);




  return (<div>
    {!chatRoomId || chatRoomId.length === 0 ? <ChatList/> :
      isJoined(whoami?.whoami!, chat!) ? <div> <CUserList/>  </div> : <ChatList/>}

  </div>);
}
export default ChatInfo;

/*

    <ChatList/>
    <CUserList/>

    {!chatRoomId || chatRoomId.length === 0 ? <ChatList/> :
      isJoined(whoami?.whoami!, chat!) ? <div> <CUserList/> <ChatCommands/> </div> : <ChatList/>}



    {!chatRoomId || chatRoomId.length === 0 ? <ChatList/> :
      isJoined(whoami?.whoami!, chat!) ? <CUserList/> : <ChatList/>}


&& chat && isJoined(whoami?.whoami!, chat)


*/
