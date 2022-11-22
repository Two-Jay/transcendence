import { Button, Dropdown, Textarea } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import {RecoilState, useRecoilState, useRecoilValue } from "recoil";
import { SocketContext } from "../context/SocketContext";
import { isJoined } from "../recoil/chatFn";
import { currentChatRoomIdAtom, chatSelector, selectedUserAtom } from "../recoil/chatState";
import { ChatRoom, MessageDataDto } from "../recoil/chatType";
import { MapUtils } from "../recoil/mapUtils";
import { userMapAtom } from "../recoil/userState";
import { UserListItemContent } from "./UserListItemContent";

const ChatPrivateCommand: React.FC = () => {

  //const whoami = useRecoilValue(whoamiAtom);
  const socket = useContext(SocketContext);
  const chatRoomId = useRecoilValue(currentChatRoomIdAtom);
  const [selectedUser, setSelectedUser] = useRecoilState(selectedUserAtom);
  const chat = useRecoilValue(chatSelector(chatRoomId) as RecoilState<ChatRoom>);
  const [privateMessage, setPrivateMessage] = useState<string>("");
  const users = useRecoilValue(userMapAtom);


  useEffect(()=>{

  }, [chatRoomId]);


  return (<div>

    <Dropdown
      label="Private"
      pill={true}
      color="light"
      size="sm"
      inline={false}
    >


      <Dropdown.Header>
        <span className="block text-sm">chatId: {chatRoomId || 'not selected'}</span>
        <span className="block text-sm">selectedUser: {selectedUser || 'not selected'}</span>

      </Dropdown.Header>


      <Dropdown.Item>
        <Dropdown label="select from  users" inline={true}>
          {MapUtils.toArray(users).filter(user=>user.isOnline && !isJoined(user.login, chat)).map(user=>{
            return (<Dropdown.Item
              key={user.login}
              onClick={()=>setSelectedUser(user.login)}>

              <UserListItemContent upperText={user.nickname} lowerText={user.login} />

            </Dropdown.Item>)
          })}
        </Dropdown>
      </Dropdown.Item>

      <Dropdown.Item>
        <form className="flex flex-col gap-2"
          onSubmit={(e)=>{
            e.preventDefault();
            if (!selectedUser || privateMessage === '') return;
            const target_login = selectedUser;
            const messageDataDto = new MessageDataDto(undefined, '%' + target_login, privateMessage);
            console.log('emit private--->', messageDataDto);
            socket?.emit("private", messageDataDto);
            setPrivateMessage("");
          }}
        >
        <Textarea placeholder={"message"} value = {privateMessage} rows={1}
          onChange={(e) => setPrivateMessage(e.target.value)}/>
        <Button type="submit" size="sm" color="light">Send</Button>
        </form>

      </Dropdown.Item>


    </Dropdown>








  </div>);
}

export default ChatPrivateCommand;
