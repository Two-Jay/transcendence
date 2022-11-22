import React, { useEffect } from "react";
import { whoamiAtom } from "../recoil/whoamiState";
import { Label } from "flowbite-react";
import { nicknameAtom } from "../recoil/nicknameState";
import { ChatRoom } from "../recoil/chatType";
import { useRecoilState, useRecoilValue, RecoilState } from "recoil";
import { socketConnectedAtom } from "../recoil/socketState";
import { currentChatRoomIdAtom, chatSelector } from "../recoil/chatState";
import { isJoined } from "../recoil/chatFn";
import { UserAvatarListItemContent } from "./UserListItemContent";
import { userMapAtom } from "../recoil/userState";
import moment from "moment";

type MessagesProps = {
  height: number;
}

const Messages: React.FC<MessagesProps> = ({height}) => {

  const whoami = useRecoilValue(whoamiAtom);
  const nickname = useRecoilValue(nicknameAtom);

  //const [username, setUsername] = useState(bWhoami?whoami?.whoami:"noname");
  const username = whoami?.whoami;

  // const [messages, setMessages] = useRecoilState<Message[]>(messagesAtom);

  const [chatRoomId, _0] = useRecoilState(currentChatRoomIdAtom);

  const chat = useRecoilValue(chatSelector(chatRoomId) as RecoilState<ChatRoom>);
  const users = useRecoilValue(userMapAtom);


  //const [rooms, setRooms] = useRecoilState(roomsAtom);
  //const addMsgToRoom = useSetRecoilState(addMsgToRoomSelector(roomId));

  //const [rooms, setRooms] = useState<Room[]>([]);

  const [connected, _1] = useRecoilState(socketConnectedAtom);

  useEffect(() => {
    socketInitLocal();
    return ()=>{
      socketFinalLocal();
    }
  }, [() => {
    // let box = document.getElementById('journal-scroll');
    // if (box && box.scrollHeight)
    //   box!.scrollTop = box!.scrollHeight;
  }]);

  // var box = document.getElementById('journal-scroll');
  // box.scrollTop = box.scrollHeight;

  const socketInitLocal = async () => {

      console.log("socketInitLocal-Messages")
  };

  const socketFinalLocal = async() => {
    //if (socket.connected) {
      console.log("socketFinalLocal-Messages")

      let box = document.getElementById('journal-scroll');
      if (box && box.scrollHeight)
        box!.scrollTop = box!.scrollHeight;

    //}
  }
//  <div className={`bg-${connected?"blue":"red"}-100 p-4 min-w-max`}>

//roomID: {roomId},
  return (<div>
  <div className={`bg-${connected?"blue":"red"}-100 p-4 max-w-4xl`}>
    <div className={`flex flex-col gap-2 h-${height}`}>

      <div className="mb-2 block">
          <Label>
            <div className="dark:text-blue-900">
              Username: <span className="text-yellow-400">{username}&nbsp;&nbsp;</span>
              Nickname: <span className="text-yellow-400">{nickname}&nbsp;&nbsp;</span>
            </div>
          </Label>
        <div>
          <Label >
          <div className="dark:text-blue-900">
            TYPE:&nbsp;
            <span className="text-yellow-400">
            {chat?.roomType || 'not selected'}&nbsp;&nbsp;
            </span>
            ID:&nbsp;
            <span className="text-yellow-400">
            {chatRoomId || 'not selected'}&nbsp;&nbsp;
            </span>
            TITLE:&nbsp;
            <span className="text-yellow-400">
            {chat?.title || 'not selected'}&nbsp;&nbsp;
            </span>
          </div>
          </Label>
        </div>
      </div>

        <main className="gap-4 flex flex-col w-full">
          { (
            <>
              <div className="flex flex-col justify-end bg-white h-[23rem] min-w-[33%] rounded-md shadow-md w-full">
                <div className="h-full last:border-b-0 overflow-y-scroll w-full" id="journal-scroll">
                  {
                    !isJoined(whoami?.whoami!, chat!) ? (<div></div>) :
                    chat?.message?.map((msg, i) => {
                      //_handleRoom is the better place to do this
                      //if (users.get(msg.author?.slice(1) as string)?.isBlock) return null;

                      return (
                        <div
                          className="w-full py-1 px-2 border-b border-gray-200"
                          key={i}
                        >

                          <UserAvatarListItemContent altStr={users.get(msg.author?.slice(1) as string)?.avatar!}
                          imgSrcStr={users.get(msg.author?.slice(1) as string)?.avatarImgSrc!}
                          bStatus={false}
                          upperText={users.get(msg.author?.slice(1) as string)?.nickname!}
                          middleText={moment(msg.timeStamp).format('hh:mm:ss a')}
                          bFlag={'chat'}
                          lowerText={msg.content!} />

                        </div>
                      );
                  }

                  )


                  }
                </div>
              </div>
            </>
          )}
        </main>
      </div>

    </div>
  </div>);

}

export default Messages;


/*


*/
