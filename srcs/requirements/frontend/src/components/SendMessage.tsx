import { Button, TextInput } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { RecoilState, useRecoilState, useRecoilValue } from "recoil";
import { SocketContext } from "../context/SocketContext";
import { isJoined } from "../recoil/chatFn";
import { currentChatRoomIdAtom, chatSelector } from "../recoil/chatState";
import { MessageDataDto, ChatRoom } from "../recoil/chatType";
import { socketConnectedAtom } from "../recoil/socketState";
import { whoamiAtom } from "../recoil/whoamiState";

const SendMessage: React.FC = () => {

  const whoami = useRecoilValue(whoamiAtom);
  const [message, setMessage] = useState("");
  const chatRoomId = useRecoilValue(currentChatRoomIdAtom);
  const chat = useRecoilValue<ChatRoom | undefined>(chatSelector(chatRoomId) as RecoilState<ChatRoom>);

  const socket = useContext(SocketContext);
  const [connected, setConnected] = useRecoilState(socketConnectedAtom);

  useEffect(()=>{
    setConnected(socket.connected);
  },[socket.connected]);

  const handleSendMessage = async () => {
    try {
      if (socket.connected) {
        //const roomTitle = roomId;

        const messageDataDto : MessageDataDto = {
          timeStamp: new Date(),
          //author: `%${whoami?.whoami}` as string,
          scope: chatRoomId,
          content: message,
        }

        console.log('emit room --->', messageDataDto);
        socket?.emit("room", messageDataDto);

        setMessage("");
      }
    } catch (err) { console.log("sendMessage", err); }
  };



  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (message && socket.connected) {
        handleSendMessage();
      }
    }
  };

  return (
    <div className={`bg-${connected?"blue":"red"}-100 p-4 min-w-min`}>
        <div className="flex gap-2">
          <div className="w-full">
          <TextInput id="message"
            type="text"
            disabled={!connected || !isJoined(whoami?.whoami!, chat!)}
            placeholder={"New message..."}
            value={message}
            onChange={(e) => {
              e.preventDefault(); //ignore the keydown event during IME composition
              return setMessage(e.target.value);
            }}
            onKeyUp={handleKeypress}
          />
          </div>
          <Button
            type="button"
            color="light"
            onClick={handleSendMessage}
            disabled={!connected || !isJoined(whoami?.whoami!, chat!)}
          >
            send
          </Button>
        </div>
    </div>
  );
}

export default SendMessage;

/*

  const handleCreateRoom = async () => {
    try {
      if (socket.connected) {

        console.log('author', whoami?.whoami)

        const createRoomDataDto : MessageDataDto = {
          timeStamp: new Date(),
          //author: `%${whoami?.whoami}` as string,
          content: RoomType.public, //"public",
          option: {
            title: roomTitle,
          }
        }
        console.log('join_room =', createRoomDataDto);
        socket?.emit("join_room", createRoomDataDto);



      }
    } catch (err) {console.log("handleJoin", err); }
  };

  const handleJoinRoom = async () => {
    try {
      if (socket.connected) {


        const createRoomDataDto : MessageDataDto = {
          timeStamp: new Date(),
          //author: `%${whoami?.whoami}` as string,
          scope: roomId,
          option: {
          }
        }
        console.log('join_room =', createRoomDataDto);
        socket?.emit("join_room", createRoomDataDto);

      }
    } catch (err) { console.log("handleJoin", err); }
  };


*/


/*
        <div className="w-1/5">
          <TextInput id="room"
            type="text"
            disabled={!connected}
            placeholder={"title"}
            value={roomTitle}
            onChange={(e) => setRoomTitle(e.target.value)}
          />
        </div>

        <Button type="button" color="light"
          onClick={handleCreateRoom} disabled={!connected}
        >
          create
        </Button>

        <Button type="button" color="light"
          onClick={handleJoinRoom} disabled={!connected}
        >
          join
        </Button>

*/
