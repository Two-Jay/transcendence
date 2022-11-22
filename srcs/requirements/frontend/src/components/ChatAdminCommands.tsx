import { Button, Dropdown, TextInput } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import {RecoilState, useRecoilState, useRecoilValue } from "recoil";
import { SocketContext } from "../context/SocketContext";
import { isOwner, isJoined } from "../recoil/chatFn";
import { currentChatRoomIdAtom, chatSelector, selectedUserAtom } from "../recoil/chatState";
import { ChatRoom, MessageDataDto, RoomType } from "../recoil/chatType";
import { MapUtils } from "../recoil/mapUtils";
import { userMapAtom } from "../recoil/userState";
import { whoamiAtom } from "../recoil/whoamiState";
import { UserListItemContent } from "./UserListItemContent";

const ChatAdminCommands: React.FC = () => {

  const whoami = useRecoilValue(whoamiAtom);
  const socket = useContext(SocketContext);
  const chatRoomId = useRecoilValue(currentChatRoomIdAtom);
  const [selectedUser, _] = useRecoilState(selectedUserAtom);
  const chat = useRecoilValue(chatSelector(chatRoomId) as RecoilState<ChatRoom>);
  const [password, setPassword] = useState<string>("");
  const users = useRecoilValue(userMapAtom);


  useEffect(()=>{

  }, [chatRoomId]);


  return (<div>

    <Dropdown
      label="Admin"
      pill={true}
      color="light"
      size="sm"
      inline={false}
    >


      <Dropdown.Header>
        <span className="block text-sm">chatId: {chatRoomId || 'not selected'}</span>
        <span className="block text-sm">selectedUser: {selectedUser || 'not selected'}</span>

      </Dropdown.Header>

      {isOwner(whoami?.whoami as string, chat) ?
      <Dropdown.Item>
        <Dropdown label="invite" inline={true}>
          {MapUtils.toArray(users).filter(user=>user.isOnline && !isJoined(user.login, chat)).map(user=>{
            return (<Dropdown.Item
              key={user.login}
              onClick={()=>{
              const messageDataDto = new MessageDataDto(undefined, chatRoomId, '%' + user.login, chat)
              console.log('emit invite_room--->', messageDataDto);
              socket?.emit("invite_room", messageDataDto);
            }}>

              <UserListItemContent upperText={user.nickname} lowerText={user.login} />

            </Dropdown.Item>)
          })}
        </Dropdown>
      </Dropdown.Item>
      : null}

      {/*
      <Dropdown.Item onClick={()=>{
        try {
          if (socket.connected) {
            const password = chatAdminInput;
            if (password.length !== 4 ||  !(/^\d+$/.test(password))) {
              console.log("4-digit-number is required")
              setToasts((curVal)=>{
                const message = chatRoomId + ": 4-digit-number is required for the password";
                const toast = new FToast("4-digit-number"+chatRoomId, ToastType.HiExclamation,  message, 30);
                return MapUtils.set(curVal, toast.id, toast);
              });
              setChatAdminInput("");
              return;
            }
            const messageDataDto = new MessageDataDto(undefined, chatRoomId, undefined, password);
            console.log('emit password', messageDataDto);
            socket?.emit("password", messageDataDto);
            setChatAdminInput("");

          }
        } catch (err) { console.log("handlePassword", err); }

      }}>
        password
      </Dropdown.Item>
      */}

      {isOwner(whoami?.whoami as string, chat) && chat.roomType !== RoomType.private?
      <Dropdown.Item>
        <Dropdown label="password" inline={true}>
          <Dropdown.Item >
            <form className="flex gap-2"
              onSubmit={(e)=>{
                e.preventDefault();
                //if (password === '') return;
                const messageDataDto = new MessageDataDto(undefined, chatRoomId, undefined, password);
                console.log('emit password--->', messageDataDto);
                socket?.emit("password", messageDataDto);
                //setPassword("");
              }}
            >
            <TextInput minLength={4} maxLength={4} pattern="[0-9]{4}"
              placeholder={password}
              onChange={(e) => setPassword(e.target.value)}/>
            <Button type="submit" size="sm" color="light">go</Button>
            </form>
          </Dropdown.Item>
        </Dropdown>

      </Dropdown.Item>
      : null}



      {isOwner(whoami?.whoami as string, chat) && isJoined(selectedUser, chat) ?
      <Dropdown.Item onClick={()=>{
        try {
          if (socket.connected) {

            const target_login = selectedUser;
            const messageDataDto = new MessageDataDto(undefined, chatRoomId, '%'+target_login);
            console.log('emit be_admin--->', messageDataDto);
            socket?.emit("be_admin", messageDataDto);

          }
        } catch (err) { console.log("handleBeAdmin", err); }

      }}>
        be_admin
      </Dropdown.Item>
      : null}

      {isJoined(selectedUser, chat) && !isOwner(selectedUser, chat) ?
      <Dropdown.Item onClick={()=>{

        try {
          if (socket.connected) {

            const target_login = selectedUser;
            //const duration = 30; //60sec
            const createRoomDataDto : MessageDataDto = {
              timeStamp: new Date(),
              //author: `%${whoami?.whoami}` as string,
              scope: chatRoomId,
              content: '%' + target_login,
            }
            console.log('emit mute--->', createRoomDataDto);
            socket?.emit("mute", createRoomDataDto);

          }
        } catch (err) { console.log("handleMute", err); }


      }}>
        mute
      </Dropdown.Item>

      : null}



      {isJoined(selectedUser, chat) && !isOwner(selectedUser, chat) ?
      <Dropdown.Item onClick={()=>{

        try {
          if (socket.connected) {
            const target_login = selectedUser;
            const messageDataDto = new MessageDataDto(undefined, chatRoomId, '%'+target_login);
            console.log('emit kick--->', messageDataDto);
            socket?.emit("kick", messageDataDto);
          }
        } catch (err) { console.log("handleKick", err); }

      }}>
        kick
      </Dropdown.Item>
      : null}


      {isJoined(selectedUser, chat) && !isOwner(selectedUser, chat) ?
      <Dropdown.Item onClick={()=>{

        try {
          if (socket.connected) {

            const target_login = selectedUser;
            const messageDataDto = new MessageDataDto(undefined, chatRoomId, '%'+target_login);
            console.log('emit ban--->', messageDataDto);
            socket?.emit("ban", messageDataDto);
          }
        } catch (err) { console.log("handleBan", err); }
      }}>
        ban
      </Dropdown.Item>
      : null}

      {/*
      <Dropdown.Item onClick={()=>{
        try {
          if (socket.connected) {
            const target_login = selectedUser;
            const messageDataDto = new MessageDataDto(undefined, '%' + target_login, chatAdminInput);
            console.log('emit private', messageDataDto);
            socket?.emit("private", messageDataDto);
            setChatAdminInput("");
          }
        } catch (err) { console.log("handlePrivate", err); }

      }}>
        private message
      </Dropdown.Item>
      */}




    </Dropdown>








  </div>);
}

export default ChatAdminCommands;
