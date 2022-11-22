import { Button, ListGroup, Tooltip } from "flowbite-react";
import { useContext, useEffect } from "react";

import {RecoilState, useRecoilState, useRecoilValue } from "recoil";
import { SocketContext } from "../context/SocketContext";
import { isJoined, isAdmin } from "../recoil/chatFn";
import { currentChatRoomIdAtom, chatSelector, selectedUserAtom } from "../recoil/chatState";
import { MessageDataDto, ChatRoom } from "../recoil/chatType";
import { chatUserListVisitCountAtom, socketConnectedAtom } from "../recoil/socketState";
import { whoamiAtom } from "../recoil/whoamiState";
import { MapUtils } from "../recoil/mapUtils";
import ChatAdminCommands from "./ChatAdminCommands";
import { userMapAtom } from "../recoil/userState";
import { UserAvatarListItemContent } from "./UserListItemContent";
import ChatPrivateCommand from "./ChatPrivateCommand";
import { useRouter } from "next/router";

const CUserList: React.FC = () => {
  const router = useRouter();
  const whoami = useRecoilValue(whoamiAtom);
  const socket = useContext(SocketContext);
  const chatRoomId = useRecoilValue(currentChatRoomIdAtom);
  const chat = useRecoilValue(chatSelector(chatRoomId) as RecoilState<ChatRoom>);
  const connected = useRecoilValue(socketConnectedAtom);
  const [selectedUser, setSelectedUser] = useRecoilState(selectedUserAtom);
  const users = useRecoilValue(userMapAtom);
  const [chatUserListVisitCount, setChatUserListVisitCount] = useRecoilState(chatUserListVisitCountAtom);

  useEffect(()=>{
    console.log("==chat member updated==", chat?.member?.size)
    //usersRefresh();
  }, [chat?.member]);



  useEffect(()=>{
    if (chatUserListVisitCount === 0) {
      setChatUserListVisitCount(curVal=>curVal+1);
      router.push('/update');
      //router.reload();
      //router.replace(router.asPath);
    }
  }, [chatUserListVisitCount]);

  useEffect(() => {
    try {
      socketInitLocal();

      return ()=>{
        socketFinalLocal();
      }
    } catch (err) { console.log("useEffect-CUserList", err); return;}
  }, [socket]);

  const socketInitLocal = async () => {
    console.log("socketInitLocal-CUserList")

  };

  const socketFinalLocal = async() => {
    console.log("socketFinalLocal-CUserList")
  }

  const handleLeaveRoom = async () => {
    try {
      if (socket.connected) {

        const roomDataDto : MessageDataDto = {
          timeStamp: new Date(),
          //author: `%${whoami?.whoami}` as string,
          scope: chatRoomId,
          option: {
          }
        }
        console.log('emit leave_room --->', roomDataDto);
        socket?.emit("leave_room", roomDataDto);
        //setChatRoomId('');


      }
    } catch (err) { console.log("handleLeaveRoom", err); }
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

  return (
  <div className={`bg-${connected?"blue":"red"}-100 p-4 min-w-min`}>
  <div className="flex flex-col gap-2"></div>

    <h3 className="py-1 text-center bg-gray-500 text-white font-bold rounded-t-lg">User List ({chat?.member?.size}) ({users?.size}) </h3>

    <div className=" h-72 overflow-y-auto">
      <div className="w-full h-full">
      <ListGroup>

          { MapUtils.toArray(chat?.member).map(mDetail => {

            let admin: boolean = isAdmin(mDetail.login, chat);
            if (admin) console.log(mDetail.login, "is the owner of ", chat.roomId)

            return (
              <ListGroup.Item
                      key={mDetail.login}
                      active={mDetail.login===selectedUser}
                      onClick={() => {
                        setSelectedUser(mDetail.login);
                        console.log("***selectedUser***", mDetail.login);
                      }}
              >

                <UserAvatarListItemContent altStr={users.get(mDetail.login)?.avatar!}
                imgSrcStr={users.get(mDetail.login)?.avatarImgSrc!}
                bStatus={admin}
                upperText={users.get(mDetail.login)?.nickname!}
                lowerText={mDetail.login}/>

              </ListGroup.Item>
            );
            })
          }

      </ListGroup>
      </div>
    </div>

    <div className="flex pt-4 gap-2 ">
      {/*
      <div className="w-2/5">

        <TextInput id="room"
          type="text"
          maxLength={100}
          disabled={!connected}
          placeholder={"chatAdminInput"}
          value={chatAdminInput}
          onChange={(e) => setChatAdminInput(e.target.value)}
        />
      </div>
      */}


      <Tooltip  content={'leave'} style="auto">
      <Button type="button" color="light" pill={true} size={'sm'}
        onClick={handleLeaveRoom} disabled={!connected || !isJoined(whoami?.whoami!, chat!)}
      >
        L
      </Button>
      </Tooltip>

      {isAdmin(whoami?.whoami!, chat!) ? <ChatAdminCommands/>:null}
      <ChatPrivateCommand/>

      {selectedUser == null || selectedUser == '' || !users.has(selectedUser) || selectedUser === whoami?.whoami ? null :
      <Tooltip  content={'profile'} style="auto">
      <Button type="button" color="light" pill={true} size={'sm'}
        onClick={()=>{
          router.push('/users/'+selectedUser);
        }}
      >
        P
      </Button>
      </Tooltip>
      }

    </div>

  </div>
  );
}
export default CUserList;



/*


                  <Button color="light" size="xs" onClick={()=>alert(selectedUser as string)}>
                    <GiMute/>
                  </Button>

                  <Button color="warning" size="xs" onClick={()=>alert(selectedUser as string)}>
                     <BsVolumeMuteFill/>
                  </Button>

                  <Button color="warning" size="xs" onClick={()=>alert(selectedUser as string)}>
                     <FaVolumeMute/>
                  </Button>



                  <Tooltip content={mDetail.login} style="auto">
                  <Label color={"light"}>{users.get(mDetail.login)?.nickname}</Label>
                  </Tooltip>




                  <Tooltip content={`${owner? "admin":"not admin"}`} style="auto">
                  <Checkbox id="owner" readOnly checked={owner}/>
                  </Tooltip>


          {room?.members?.forEach((mem, index) => {
            //console.log("===mem===", mem);
            return (
              <ListGroup.Item icon={HiUserCircle}
                key={mem}
                active={mem===activeMember}
                onClick={() => {
                    setActiveMember(mem);
                }}
              >
                <div className="flex w-full gap-4  items-center">
                  <Label color={"light"}>{mem}</Label>
                </div>

              </ListGroup.Item>
              );
            })
          }


*/


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
