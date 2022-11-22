import { Button, Checkbox, Dropdown, Label, ListGroup, TextInput, Tooltip } from "flowbite-react";
import { useContext, useState } from "react";
import {RecoilState, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { SocketContext } from "../context/SocketContext";
import { isJoined } from "../recoil/chatFn";
import { currentChatRoomIdAtom, chatRoomMapAtom, chatSelector } from "../recoil/chatState";
import { MessageDataDto, ChatRoom, RoomType } from "../recoil/chatType";
import {  MapUtils } from "../recoil/mapUtils";
import { socketConnectedAtom } from "../recoil/socketState";
import { toastMapAtom } from "../recoil/toastState";
import { FToast, ToastType } from "../recoil/toastType";
import { whoamiAtom } from "../recoil/whoamiState";
import { UserAvatarListItemContent } from "./UserListItemContent";
const ChatList: React.FC = () => {

  const whoami = useRecoilValue(whoamiAtom);
  const socket = useContext(SocketContext);

  const chats = useRecoilValue(chatRoomMapAtom);
  const [chatRoomId, setChatRoomId] = useRecoilState(currentChatRoomIdAtom);
  const chat = useRecoilValue(chatSelector(chatRoomId) as RecoilState<ChatRoom>);

  const connected = useRecoilValue(socketConnectedAtom);
  const [chatInput, setChatInput] = useState("");

  const setToasts = useSetRecoilState(toastMapAtom);


  const handleCreateRoom = async (isPublic:boolean) => {
    try {
      if (socket.connected) {
        if (chatInput === '') return;
        const roomType = isPublic? RoomType.public : RoomType.private;
        const createRoomDataDto = new MessageDataDto(undefined, undefined, roomType, {title: chatInput});
        console.log('emit create_room --->', createRoomDataDto);
        socket?.emit("create_room", createRoomDataDto);
        setChatInput("");
      }
    } catch (err) {console.log("handleCreateRoom", err); }
  };

  const handleJoinRoom = async () => {
    try {
      if (socket.connected) {

        const password = chatInput;
        if (!(password === '' || (password.length === 4 && /^\d+$/.test(password))) ) {
          setToasts((curVal)=>{
            const message = chatRoomId + ": 4-digit-number is required for the password";
            const toast = new FToast("4-digit-number"+chatRoomId, ToastType.HiExclamation,  message, 30);
            return MapUtils.set(curVal, toast.id, toast);
          });
          setChatInput("");
          return;
        }
        const joinRoomDataDto = new MessageDataDto(undefined, chatRoomId, undefined, {password: password});
        console.log('emit join_room --->', joinRoomDataDto);
        socket?.emit("join_room", joinRoomDataDto);

      }
    } catch (err) { console.log("handleJoinRoom", err); }
  };
  /*
  const handleChangeTitle = async () => {
    try {
      if (socket.connected) {

        //emit change_title
        //then listen _change_title
        setChats(curVal=>ChatMapUtils.set_attr(curVal, chatRoomId, "title", chatInput));

      }
    } catch (err) { console.log("handleChangeTitle", err); }
  };
  */
 /*
  const handleDelete = async () => {
    try {
      if (socket.connected) {

        //listen _delete
        setChats(curVal=>MapUtils.delete(curVal, chatRoomId));
        setChatRoomId('');

      }

    } catch (err) { console.log("handleDelete", err); }
  };
*/
  return (
  <div className={`bg-${connected?"blue":"red"}-100 p-4 min-w-min`}>
    <h3 className="py-1 text-center bg-gray-500 text-white font-bold rounded-t-lg">Chat List ({chats.size}) </h3>

    <div className=" h-72 overflow-y-auto">
      <div className="w-full h-full">
      <ListGroup>

          {MapUtils.toArray(chats).map((chat) => {

              let joined: boolean = isJoined(whoami?.whoami!, chat);

              return (
              <ListGroup.Item
                key={chat.roomId}
                active={chat.roomId===chatRoomId}
                onClick={() => {
                    setChatRoomId(chat.roomId);
                    console.log("currentChatRoomId=",chatRoomId);
                }}
              >
                <div className="flex w-full gap-4  items-center bg-slate-00 rounded-lg">
                  <Tooltip
                      content={`${joined? "joined":"not joined yet"}`}
                      style="auto"
                    >
                  <Checkbox
                    id="joined"
                    readOnly
                    checked={joined}/>
                  </Tooltip>

                  <Label color={"light"}>
                    {/* {chat.roomType} : {chat.roomId} : {chat.title} */}
                    <UserAvatarListItemContent
                          bStatus={false}
                          bFlag={'room'}
                          upperText={chat.roomId}
                          middleText={chat.roomType}
                          lowerText={chat.title} />
                  </Label>

                </div>

              </ListGroup.Item>
              );
            })
          }
      </ListGroup>
      </div>
    </div>



    <div className="flex pt-4 gap-2 ">

      <div className="w-2/5">

        <TextInput id="chatTitle"
          type="text"
          maxLength={20}
          disabled={!connected}
          placeholder={"chatInput"}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        />
      </div>

      <Dropdown
      label="Create"
      pill={true}
      color="light"
      size="sm"
      inline={false}
      >
        <Dropdown.Item onClick={()=>handleCreateRoom(true)}>
          create public
        </Dropdown.Item>

        <Dropdown.Item onClick={()=>handleCreateRoom(false)}>
          create private
        </Dropdown.Item>

      </Dropdown>

      {/*<Tooltip  content={'join'} style="auto">*/}
      <Button type="button" color="light" pill={true} size={'sm'}
        onClick={handleJoinRoom} disabled={!connected || isJoined(whoami?.whoami!, chat!) || !chatRoomId}
      >
        Join
      </Button>
      {/*</Tooltip>*/}
      {/*
      <Tooltip  content={'delete test'} style="auto">
      <Button type="button" color="light" pill={true} size={'sm'}
        onClick={handleDelete} disabled={!connected}
      >
        D
      </Button></Tooltip>
      */}

    </div>



  </div>
  );
}
export default ChatList;




/*

    <div className="flex gap-2">

      <div className="w-1/5">

        <TextInput id="room"
          type="text"
          disabled={!connected}
          placeholder={"title"}
          value={chatTitle}
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


    </div>

*/




/*


                <Avatar
                  alt="User menu"
                  img = {"/avatar.png"}
                  rounded
                  onClick={()=>alert("avatar " + room.id)}
                />
                <Button
                  color={"light"}
                  pill={true}
                  label={"a"}
                  onClick={()=>alert("button " + room.id)}
                >AAA</Button>

                <Tooltip
                    content="Tooltip content"
                    style="auto"
                  >
                    <Button>
                      Light tooltip
                    </Button>
                  </Tooltip>


*/




/*
    <ListGroup active className="w-48">
        <h3 className="text-center bg-red-500 text-white font-bold rounded-t-lg">User list</h3>
        <ListgroupItem className="text-base font-semibold gap-2">
          <Avatar src="/images/profile-picture-1.webp" size="xs"/>Jese Leos
        </ListgroupItem>
        <ListgroupItem className="text-base font-semibold gap-2">
          <Avatar src="/images/profile-picture-2.webp" size="xs"/>Robert Gouth
        </ListgroupItem>
        <ListgroupItem className="text-base font-semibold gap-2">
          <Avatar src="/images/profile-picture-3.webp" size="xs"/>Bonnie Green
        </ListgroupItem>
        <a href="/" className="flex items-center p-3 text-sm font-medium text-red-600 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mr-3"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
    Delete user
      </a>
    </Listgroup>

*/


/*


<div className="w-fit">
  <Sidebar aria-label="Default sidebar example">
    <Sidebar.Items>
      <Sidebar.ItemGroup>
        <Sidebar.Item
          href="#"
          icon={HiChartPie}
        >
          Dashboard
        </Sidebar.Item>
        <Sidebar.Item
          href="#"
          icon={HiViewBoards}
          label="Pro"
          labelColor="alternative"
        >
          Kanban
        </Sidebar.Item>
        <Sidebar.Item
          href="#"
          icon={HiInbox}
          label="3"
        >
          Inbox
        </Sidebar.Item>
        <Sidebar.Item
          href="#"
          icon={HiUser}
        >
          Users
        </Sidebar.Item>
        <Sidebar.Item
          href="#"
          icon={HiShoppingBag}
        >
          Products
        </Sidebar.Item>
        <Sidebar.Item
          href="#"
          icon={HiShoppingBag}
        >
          Sign In
        </Sidebar.Item>
        <Sidebar.Item
          href="#"
          icon={HiShoppingBag}
        >
          Sign Up
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar.Items>
  </Sidebar>
</div>


*/
