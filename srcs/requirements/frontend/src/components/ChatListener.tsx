import { useCallback, useContext, useEffect } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { SocketContext } from "../context/SocketContext";
import {  chatRoomMapAtom, currentChatRoomIdAtom } from "../recoil/chatState";
import { chatUserListVisitCountAtom, socketConnectedAtom, socketWelcomeKitAtom } from "../recoil/socketState";
import { MessageDataDto, ChatRoom, RoomType } from "../recoil/chatType";
import { accessLevelAtom, whoamiAtom } from "../recoil/whoamiState";
import { GameRoomDto } from "../recoil/gameType";
import { ChatMapUtils, GameMapUtils, MapUtils, UserMapUtils } from "../recoil/mapUtils";
import { userMapAtom } from "../recoil/userState";
import { User } from "../recoil/userType";
import { toastMapAtom } from "../recoil/toastState";
import { FToast, ToastType } from "../recoil/toastType";
import { nanoid } from "nanoid";
import { IDetail } from "../recoil/socketType";
import { gameMapAtom } from "../recoil/gameState";
import { useRecoilCacheRefresh } from "../recoil/recoilUtils";
import { nicknameAtom } from "../recoil/nicknameState";
import { getCookie } from 'cookies-next';
import { useRouter } from "next/router";

const ChatListener: React.FC = () => {

  const router = useRouter();
  const whoami = useRecoilValue(whoamiAtom);
  const socket = useContext(SocketContext);
  const [connected, setConnected] = useRecoilState(socketConnectedAtom);
  const connectedRefresh = useRecoilCacheRefresh(socketConnectedAtom);

  const accessLevelRefresh = useRecoilCacheRefresh(accessLevelAtom);

  const setWelcomeKit = useSetRecoilState(socketWelcomeKitAtom);
  const [users, setUsers] = useRecoilState(userMapAtom);
  //const usersRefresh = useRecoilCacheRefresh(userMapAtom);
  const setChatRooms = useSetRecoilState(chatRoomMapAtom);
  const [chatRoomId, setChatRoomId] = useRecoilState(currentChatRoomIdAtom);
  const chatRoomIdRefresh = useRecoilCacheRefresh(currentChatRoomIdAtom);

  const setGames = useSetRecoilState(gameMapAtom);
  const setToasts = useSetRecoilState(toastMapAtom);

  const [nickname, setNickname] = useRecoilState(nicknameAtom);
  const nicknameRefresh = useRecoilCacheRefresh(nicknameAtom);

  const [_, setChatUserListVisitCount] = useRecoilState(chatUserListVisitCountAtom);

  useEffect(() => {
    socketInitLocal();

    return ()=>{
      socketFinalLocal();
    }
  }, [socket]);


  const socketInitLocal = async () => {
    console.log("socketInitLocal-ChatListener");
    socket?.on("_is_alive", _handleIsAlive);

    socket?.on("_connect", _handleConnect);
    socket?.on("_disconnect", _handleDisconnect);
    socket?.on("_iDetail", _handleIDetail);

    socket?.on("_welcome_kit", _handleWelcomeKit);
    socket?.on("_create_room", _handleCreateRoom);
    socket?.on("_delete_room", _handleDeleteRoom);
    socket?.on("_join_room", _handleJoinRoom);
    socket?.on("_leave_room", _handleLeaveRoom);

    socket?.on("_banned_room", _handleBannedRoom);
    socket?.on("_wrong_password_room", _handleWrongPasswordRoom);

    socket?.on("_invite_room", _handleInviteRoom);
    socket?.on("_password", _handlePassword);
    socket?.on("_mute", _handleMute);
    socket?.on("_be_admin", _handleBeAdmin);
    socket?.on("_kick", _handleKick);
    socket?.on("_ban", _handleBan);

    socket?.on("_room", _handleRoom);
    socket?.on("_private", _handlePrivate);


  };

  const socketFinalLocal = async() => {
    console.log("socketFinalLocal-ChatListener")
    socket?.off("_is_alive", _handleIsAlive);

    socket?.off("_connect", _handleConnect);
    socket?.off("_disconnect", _handleDisconnect);
    socket?.off("_iDetail", _handleIDetail);

    socket?.off("_welcome_kit", _handleWelcomeKit);
    socket?.off("_create_room", _handleCreateRoom);
    socket?.off("_delete_room", _handleDeleteRoom);
    socket?.off("_join_room", _handleJoinRoom);
    socket?.off("_leave_room", _handleLeaveRoom);

    socket?.off("_banned_room", _handleBannedRoom);
    socket?.off("_wrong_password_room", _handleWrongPasswordRoom);

    socket?.off("_invite_room", _handleInviteRoom);
    socket?.off("_password", _handlePassword);
    socket?.off("_mute", _handleMute);
    socket?.off("_be_admin", _handleBeAdmin);
    socket?.off("_kick", _handleKick);
    socket?.off("_ban", _handleBan);

    socket?.off("_room", _handleRoom);
    socket?.off("_private", _handlePrivate);
  }

  const _handleIsAlive = useCallback((msg: MessageDataDto)=>{
    try{

      console.log('=====> from server _handleIsAlive-ChatListener', msg);
      const tfa = getCookie('tfa');
      const profile = getCookie('profile');

      if (tfa == null || profile == null) {
        setToasts((curVal)=>{
          const message = 'You are now logged out.';
          const toast = new FToast("logout", ToastType.HiCheck, message, 10);
          return MapUtils.set(curVal, toast.id, toast);
        });
        socket.close();
        router.push('/logout');
      }


    } catch(err) { console.log("_handleIsAlive-ChatListener", err); }
  }, []);



  const _handleConnect = useCallback((msg: MessageDataDto)=>{
    try{

      console.log('=====> from server handleConnect-ChatListener', msg);
      console.log("====socket.connected===")
      if (!connected) {
        // when refreshing aacessLevel here, something wrong happening, so did refersh in ToastList.useEffect[accessLvel]
        console.log("===_connect:accessLevelRefresh===")
        accessLevelRefresh();

        setConnected(socket.connected);
        connectedRefresh();
      }

      //console.log("===leveStr===", accessLevel.levelStr);

      //in case of reconnecting, clear userMap, chatMap and gameMap
      setUsers(new Map<string, User>());
      setChatRooms(new Map<string, ChatRoom>());
      setGames(new Map<number, GameRoomDto>());
      socket?.emit("welcome_kit", null);

    } catch(err) { console.log("_handleConnect-ChatListener", err); }
  }, []);

  const _handleDisconnect = useCallback((msg: MessageDataDto)=>{
    try {
    console.log('=====> from server handleDisconnect-ChatListener', msg);
    setConnected(false);
    //connectedRefresh();

    } catch(err) { console.log("_handleDisconnect-ChatListener", err); }
  }, []);


  const _handleIDetail = useCallback((msg: MessageDataDto)=>{
    try {

      console.log('=====> from server _handleIDetail-ChatListener', msg);

      const user2 = msg.option as User;
      console.log('=====> from server _handleIDetail-user', user2);

      //sync with whoami's nickname
      if (user2?.login === whoami?.whoami) {
        //console.log("=== Idetail myself ===", user2?.login)
        if (nickname !== user2?.nickname) {
          setNickname(()=>user2?.nickname);
          nicknameRefresh();
        }
      }

      if (!users.has(user2?.login)) return;
      let users2 : User[] = [user2];

      setUsers((curVal)=>{
        //const curVal2 = new Map<string, User>();
        const newVal = UserMapUtils.sets(curVal, users2);
        UserMapUtils.sets2(newVal)
          .then(newVal2=>newVal2?setUsers(newVal2):null);
        return newVal;
      });

/*

      setUsers((curVal)=>{
        //const curVal2 = new Map<string, User>();
        let newVal3;
        const newVal = UserMapUtils.sets(curVal, users2);
        UserMapUtils.sets2(newVal)
          .then(newVal2=>newVal2?()=>{
              setUsers(newVal2);
              newVal3 = newVal2;
            }:null)
          //.then(()=>avatarRefresh());
        //return newVal;
        return newVal3 || newVal;
      });
*/
      //for avatar sync
      //if (user2?.login === whoami?.whoami) {
//        setTimeout(
//          function() {
//            console.log("IDetail_welcome_kit emit--->")
//            socket?.emit("welcome_kit", null);
//          }, 3000);
      //}
      /*
        const newVal = UserMapUtils.sets(users, users2);
        UserMapUtils.sets2(newVal)
          .then(newVal2=>newVal2?setUsers(newVal2):null)
          //.then(()=>avatarRefresh());
      */
    } catch (err) { console.log("_handleIDetail-ChatListener", err);}

  }, []);

  const _handleWelcomeKit = useCallback((msg: MessageDataDto)=>{
    try {

      console.log('=====> from server _handleWelcomeKit-ChatListener', msg);

      if (msg == null || msg.option == null)
        return;

      //if (msg.author !==  '%SYSTEM%') return;

      setWelcomeKit(msg.option);

        //put yourself to the user map to update nickname and avatar
        let cusers : User[] = msg.option[0];
        //put friends and blocks to the user map
        cusers = [cusers, ...msg.option[1]];

        setUsers((curVal)=>{
          //const curVal2 = new Map<string, User>();
          const newVal = UserMapUtils.sets(curVal, cusers);
          UserMapUtils.sets2(newVal)
            .then(newVal2=>newVal2?setUsers(newVal2):null);
          return newVal;
        });

        //put chats to the chat map
        const chats = msg.option[2] as any[]; //id -> roomId
        const revisedChats= chats.map(chat=>({...chat, roomId: chat?.id, roomType: chat?.type})) as ChatRoom[];
        setChatRooms(curVal=>ChatMapUtils.sets(curVal, revisedChats));

        //put games to the game map
        setGames(curVal=>GameMapUtils.sets(curVal, msg.option[3] as GameRoomDto[]));


    } catch (err) { console.log("_handleWelcomeKit-ChatListener", err);}

  }, []);

  const _handleCreateRoom = useCallback((msg: MessageDataDto)=>{
    try {

      console.log('=====> from server _handleCreateRoom-ChatListener', msg);

      if (msg.author ===  '%SYSTEM%') {

        const newRoom = new ChatRoom(msg.scope as string, msg.option.title, msg.content as RoomType);
        setChatRooms(curVal=>MapUtils.set(curVal, newRoom.roomId, newRoom));

      }

    } catch (err) { console.log("_handleCreateRoom-ChatListener", err);}

  }, []);


  const _handleDeleteRoom = useCallback((msg: MessageDataDto)=>{
    try {

      console.log('=====> from server _handleDeleteRoom-ChatListener', msg);

      if (msg.author ===  '%SYSTEM%') {

        setChatRooms(curVal=>MapUtils.delete(curVal, msg.scope as string))

      }

    } catch (err) { console.log("_handleDeleteRoom-ChatListener", err);}

  }, []);

  const _handleJoinRoom = useCallback((msg: MessageDataDto)=>{
    try {

      console.log('=====> from server _handleJoinRoom-ChatListener', msg);

      if (msg.author === '%'+ whoami?.whoami) {
        //setChatRooms(curVal=>ChatMapUtils.set_attr(curVal, msg.scope!, "messages", []));
        setChatRoomId(msg.scope!);
        chatRoomIdRefresh();

      }
      //setChatRooms(curVal=>ChatMapUtils.set_attr(curVal, msg.scope!, "member", msg.option));
      //setChatRooms(curVal=>ChatMapUtils.add_members(curVal, msg.scope!, msg.option as IDetail[] ));
      const membersDetail = msg.option as IDetail[];

/////////
//owner is admin? then need to get info
////////
      // if (membersDetail.length === 1) {
      //   const newAdmin = membersDetail[0]?.login as string;
      //   //setChatRooms(curVal=>ChatMapUtils.add_owner(curVal,  msg.scope!, newAdmin));

      //   //or
      //   const messageDataDto = new MessageDataDto(undefined, msg.scope, '%'+newAdmin);
      //   console.log('emit be_admin', messageDataDto);
      //   socket?.emit("be_admin", messageDataDto);
      // }

////////
////////
      setChatRooms(curVal=>ChatMapUtils.set_members(curVal, msg.scope!, membersDetail));

      //exclude whoami?.whoami first, and then add chat members to userMap (to add/remove friend/block)
      const users = membersDetail.filter(member=> member.login !== whoami?.whoami) as User[];
      setUsers((curVal)=>{
        const newVal = UserMapUtils.sets(curVal, users);
        UserMapUtils.sets2(newVal)
          .then(newVal2=>newVal2?setUsers(newVal2):null);
        return newVal;
      });

      setChatUserListVisitCount(0);

    } catch (err) { console.log("_handleJoinRoom-ChatListener", err);}

  }, []);


  const _handleLeaveRoom = useCallback((msg: MessageDataDto)=>{
    try {

      console.log('=====> from server _handleLeaveRoom-ChatListener', msg);
      const membersDetail = msg.option as IDetail[];

/////////
//owner is admin? then need to get info
////////
      // if (membersDetail.length === 1) {
      //   const newAdmin = membersDetail[0]?.login as string;
      //   setChatRooms(curVal=>ChatMapUtils.add_owner(curVal,  msg.scope!, newAdmin));
      // }
////////
////////

      //setChatRooms(curVal=>ChatMapUtils.remove_members(curVal, msg.scope!, msg.option as IDetail[] ));
      setChatRooms(curVal=>ChatMapUtils.set_members(curVal, msg.scope!, membersDetail));

      if (msg.author === '%' + whoami?.whoami) {
        setChatRooms(curVal=>ChatMapUtils.set_attr(curVal, msg.scope!, "message", []));
        setChatRoomId('');
        chatRoomIdRefresh();
     }

    } catch (err) { console.log("_handleLeaveRoom-ChatListener", err);}

  }, []);


  const _handleBannedRoom = useCallback((msg: MessageDataDto)=>{
    try {

      console.log('=====> from server _handleBannedRoom-ChatListener', msg);

      //timeStamp: '2022-11-03T10:48:47.284Z', scope: '#5', option: 'banned'

      setToasts((curVal)=>{
        const message = "you are banned to join the chatroom " + msg.scope;
        const toast = new FToast("banned" + msg.scope, ToastType.HiX,  message, 600);
        return MapUtils.set(curVal, toast.id, toast);
      });


    } catch (err) { console.log("_handleBannedRoom-ChatListener", err);}

  }, []);

  const _handleWrongPasswordRoom = useCallback((msg: MessageDataDto)=>{
    try {

      console.log('=====> from server _handleWrongPasswordRoom-ChatListener', msg);
      console.log("_handleWrongPasswordRoom info", msg, msg.option);
      //{timeStamp: '2022-11-06T11:54:44.149Z', scope: '#55', option: 'wrong password'}
      setToasts((curVal)=>{
        const message = "The chatroom " +  msg.scope + ' is password-protected. Wrong password!';
        const toast = new FToast("wrongPassword" + msg.scope, ToastType.HiExclamation,  message, 30);
        return MapUtils.set(curVal, toast.id, toast);
      });


    } catch (err) { console.log("_handleWrongPasswordRoom-ChatListener", err);}

  }, []);



  const _handleInviteRoom = useCallback((msg: MessageDataDto)=>{
    try {
      console.log('=====> from server _handleInviteRoom-ChatListener', msg);
      let message : string;
      if (msg.author === '%SYSTEM%') {
        console.log('toRoom ===> author, scope, content:', msg.author, msg.scope, msg.content);
        message = msg.content?.slice(1) + " is invited to The chatroom " +  msg.scope;

      } else {
        console.log('toPrivate ===> author, scope, content:', msg.author, msg.scope, msg.content);
        message = msg.author?.slice(1) + " invited " + msg.content?.slice(1) + " to The chatroom " +  msg.scope;
      }



      //scope: '#1', content: '%indivisibilibus@gmail.com', author: '%seongcho'
      setToasts((curVal)=>{
        const toast = new FToast("invite" + msg.scope, ToastType.HiCheck,  message, 30);
        return MapUtils.set(curVal, toast.id, toast);
      });

      //when inviting someone to the private chatroom, he/she needs to see the room from the chatlist
      const chat = msg.option as ChatRoom;
      if (msg.content?.slice(1) === whoami?.whoami && chat && chat.roomType === RoomType.private) {
        console.log("===create private room by invitation===", chat);
        const privateRoom = new ChatRoom(chat.roomId, chat.title, chat.roomType);
        setChatRooms(curVal=>MapUtils.set(curVal, privateRoom.roomId, privateRoom));
      }

    } catch (err) { console.log("_handleInviteRoom-ChatListener", err);}
  }, []);





  const _handlePassword = useCallback((msg: MessageDataDto)=>{
    try {
      console.log('=====> from server _handlePassword-ChatListener', msg);
      let message : string;
      //author: "%seongcho" option: "1111" scope: "#54"
      if (msg.author === '%SYSTEM%') {
        console.log('broadcast ===> author, scope, option:', msg.author, msg.scope, msg.option);
        message = "The password of the chatroom " +  msg.scope + " has been set.";

      }else {
        console.log('toRoom ===> author, scope, option:', msg.author, msg.scope, msg.option);
        message = msg.author?.slice(1) + " set the password of the chatroom " +  msg.scope;
      }

      setToasts((curVal)=>{
        const toast = new FToast("password" + msg.scope, ToastType.HiCheck,  message, 30);
        return MapUtils.set(curVal, toast.id, toast);
      });


      //author: '%SYSTEM%', scope: '#2', content: 'protected'
      setChatRooms(curVal=>ChatMapUtils.set_attr(curVal, msg?.scope as string, "roomType", msg?.content));


    } catch (err) { console.log("_handlePassword-ChatListener", err);}
  }, []);


  const _handleMute = useCallback((msg: MessageDataDto)=>{
    try {
      console.log('=====> from server _handleMute-ChatListener', msg);
      console.log('author, scope, option(number):', msg.author, msg.scope, msg.option);

      //scope: '%seongcho', content: '60', author: '%seongcho', option: 1667483669

      setToasts((curVal)=>{
        const message = msg.content?.slice(1) + " is mutted in the chatroom " +  msg.scope + " for 30 sec";
        const toast = new FToast("mutted" + msg.scope, ToastType.HiX,  message, 30);
        return MapUtils.set(curVal, toast.id, toast);
      });


    } catch (err) { console.log("_handleMute-ChatListener", err);}
  }, []);


  const _handleBeAdmin = useCallback((msg: MessageDataDto)=>{
    try {
      console.log('=====> from server _handleBeAdmin-ChatListener', msg);




      const membersDetail = msg.option as IDetail[];
      setChatRooms(curVal=>ChatMapUtils.set_members(curVal, msg.scope!, membersDetail));

      //console.log('author, content:', msg.author, msg.content);

      //content: '%indivisibilibus@gmail.com', author: '%seongcho'
      //const newAdmin = msg.content?.slice(1) as string;
/////////////////
      //need msg.scope
      //console.log("ask new admin", newAdmin, " to ", msg.scope)
      //setChatRooms(curVal=>ChatMapUtils.add_owner(curVal, msg.scope!, newAdmin));





    } catch (err) { console.log("_handleBeAdmin-ChatListener catch", err);}
  }, []);


  const _handleKick = useCallback((msg: MessageDataDto)=>{
    try {
      console.log('=====> from server _handleKick-ChatListener', msg);
      console.log('author, content:', msg.author, msg.content);
      //content: '%seongcho', author: '%indivisibilibus@gmail.com'
      //need msg.scope
      setToasts((curVal)=>{
        const message = msg.content?.slice(1) + " is kicked out of the chatroom " + chatRoomId + ", " + msg.scope;
        const toast = new FToast("banned" + msg.scope, ToastType.HiX,  message, 60);
        return MapUtils.set(curVal, toast.id, toast);
      });


    } catch (err) { console.log("_handleKick-ChatListener catch", err);}
  }, []);


  const _handleBan = useCallback((msg: MessageDataDto)=>{
    try {
      console.log('=====> from server _handleBan-ChatListener', msg);
      console.log('author, content:', msg.author, msg.content);

      setToasts((curVal)=>{
        const message = msg.content?.slice(1) + " is banned from the chatroom " + msg.scope;
        const toast = new FToast("banned" + msg.scope, ToastType.HiX,  message, 60);
        return MapUtils.set(curVal, toast.id, toast);
      });



    } catch (err) { console.log("_handleInviteRoom-ChatListener", err);}
  }, []);


  const _handleRoom = useCallback((msg: MessageDataDto)=>{
    try {

      console.log('=====> from server _handleRoom-ChatListener', msg);

      const newMessage = new MessageDataDto(msg.author, msg.scope, msg.content );

      if (users.get(msg.author?.slice(1) as string)?.isBlock) return;

      setChatRooms(curVal=>ChatMapUtils.add_msg(curVal, msg.scope as string, [newMessage]));
    } catch (err) {
      console.log("_handleRoom-ChatListener catch", err);
    }

  }, []);

  const _handlePrivate = useCallback((msg: MessageDataDto)=>{
    try {

      console.log('=====> from server _handlePrivate-ChatListener', msg);

      //use ChatRoom[] or go independent like Private[]
      //const newMessage = {roomId: msg.scope, author: msg.author!, content: msg.content!};
      //const newMessage = new MessageDataDto(msg.author, msg.scope, "(private)"+msg.content );
      //setChatRooms(curVal=>ChatMapUtils.add_msg(curVal, msg.scope as string, [newMessage]));
      //scope: '%indivisibilibus@gmail.com', content: 'hello', author: '%seongcho'


      if (users.get(msg.author?.slice(1) as string)?.isBlock) return;

      setToasts((curVal)=>{
        const message = "(private) " + msg.author?.slice(1) + ": " + msg.content;
        const toast = new FToast(nanoid(), ToastType.FaTelegramPlane,  message, 60);
        return MapUtils.set(curVal, toast.id, toast);
      });




    } catch (err) {
      console.log("_handlePrivate-ChatListener catch", err);
    }

  }, []);

return (<></>);
}

export default ChatListener;
