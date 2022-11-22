// import { Button, Label, Toast } from "flowbite-react";
import { Button, Dropdown } from "flowbite-react";
// import { useCallback, useContext, useEffect, useState } from "react";
import { useContext, useEffect, useState } from "react";
// import { BiSleepy } from "react-icons/bi";
// import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { SocketContext } from "../context/SocketContext";
// import { socketConnectedAtom, socketWelcomeKitAtom } from "../recoil/socketState";
import { socketConnectedAtom } from "../recoil/socketState";
import { MessageDataDto } from "../recoil/chatType";
import {  whoamiAtom } from "../recoil/whoamiState";
// import { duelAtom, currentGameRoomIdAtom, updateGamesSelector, matchAtom } from "../recoil/gameState";
import { duelAtom, matchAtom, ballSpeedAtom, currentGameRoomIdAtom, onGameToastAtom } from "../recoil/gameState";
// import { duelAtom, currentGameRoomIdAtom } from "../recoil/gameState";
import { MapUtils } from "../recoil/mapUtils";
import { userMapAtom } from "../recoil/userState";
import { UserListItemContent } from "./UserListItemContent";
import { GameMode } from "../recoil/socketType";
// import { useRecoilCacheRefresh } from "../recoil/recoilUtils";

const PongButtons: React.FC = () => {

  const socket = useContext(SocketContext);
  // const [connected, setConnected] = useRecoilState(socketConnectedAtom);
  const [connected, _0] = useRecoilState(socketConnectedAtom);
  // const connectedRefresh = useRecoilCacheRefresh(socketConnectedAtom);
  // const [welcomeKit, setWelcomeKit] = useRecoilState(socketWelcomeKitAtom);
  // const [requestDuel, setRequestDuel] = useState(false);
  const whoami = useRecoilValue(whoamiAtom);
  // const [duel, setDuel] = useRecoilState(duelAtom);
  const [duel, _1] = useRecoilState(duelAtom);
  const resetDuel = useResetRecoilState(duelAtom);
  // const [match, setMatch] = useRecoilState(matchAtom);
  const [match, _3] = useRecoilState(matchAtom);
  // const [roomId, setRoomId] = useRecoilState(currentGameRoomIdAtom);
  //const setRoomId = useSetRecoilState(currentGameRoomIdAtom);

  const users = useRecoilValue(userMapAtom);

  const [ballSpeed, setBallSpeed] = useRecoilState(ballSpeedAtom);
  //const onGame = useRecoilValue(onGameAtom);
  const gameRoomId = useRecoilValue(currentGameRoomIdAtom);
  const [onGameToast, _2] = useRecoilState(onGameToastAtom);
  const [onGame, setOnGame] = useState<boolean>(gameRoomId !== 0 || onGameToast)


  useEffect(() => {

    setOnGame(gameRoomId !== 0);
    return ()=>{
    }
  }, [gameRoomId]);


  const handleRequestDuel = (opponent_login : string) => {
    try {
      if (socket.connected) {

        //if requested already, cancel the request
        //wait for 10 sec?
        if (duel?.fromId === whoami?.whoami && duel?.request) {

          console.log("emit cancel_duel", null);
          socket?.emit("cancel_duel", null);
          resetDuel();
          return;
        }
        //else request

        //first, get opponent_login from online user list
        //const opponent_login = "kyuhkim";
        //then

        const messageDataDto : MessageDataDto = {
          timeStamp: new Date(),
          //author: `%${whoami?.whoami}` as string,
          scope: `%${opponent_login}`,
          content: "request_duel",
          option: ballSpeed,
        }

        //check if requested
        //if same user then accept
        if (duel?.beRequested && duel?.fromId === opponent_login) {

          const acceptMessageDataDto : MessageDataDto = {
            timeStamp: new Date(),
            scope: `%${duel.fromId}`,
            content: "accept_duel",
          }

          console.log("emit accept_duel", acceptMessageDataDto);
          socket?.emit("accept_duel", acceptMessageDataDto);

        //else if other user then reject and then request a duel to opponent_login
        } else if (duel?.beRequested && duel?.fromId !== opponent_login) {

          const rejectMessageDataDto : MessageDataDto = {
            timeStamp: new Date(),
            scope: `%${duel.fromId}`,
            content: "reject_duel",
          }
          console.log("emit reject_duel", rejectMessageDataDto);
          socket?.emit("reject_duel", rejectMessageDataDto);

          //reject and then request a dual again
          console.log("emit duel", messageDataDto);
          socket?.emit("duel", messageDataDto);

        //else  request a duel to opponent_login
        } else {
          console.log("emit duel", messageDataDto);
          socket?.emit("duel", messageDataDto);
        }



        /*
        setDuel((curDuel)=>{
          const newDuel = {...curDuel};
          newDuel.fromId = whoami?.whoami;
          newDuel.toId = msg.scope!;
          if (msg.author === whoami?.whoami)
            newDuel.request = true;
          else if (msg.scope === whoami?.whoami)
            newDuel.beRequested = true;
          newDuel.timeStamp = new Date();
          return newDuel;
        })

*/

      }
    } catch (err) {console.log("handleRequestDuel", err)};
 }

 const handleRequestMatch = () => {
  try {
    if (socket.connected) {

      //if requested already, cancel the request
      //wait for 10 sec?
      if (match?.request) {

        const messageDataDto : MessageDataDto = {
          timeStamp: new Date(),
          content: "cancel_request_match",
        }

        console.log("emit cancel_request_match", messageDataDto);
        socket?.emit("cancel_request_match", messageDataDto);
        return;
      }

      //else request

      //first, get opponent_login from online user list
      // const opponent_login = "kyuhkim";
      //then

      const messageDataDto : MessageDataDto = {
        timeStamp: new Date(),
        content: "request_match",
        option: ballSpeed,
      }

      console.log("emit request_match--->", messageDataDto);
      //socket?.emit("request_duel", messageDataDto);
      socket?.emit("request_match", messageDataDto);
    }
  } catch (err) {console.log("handleRequestMatch", err)};
}


const handleAcceptDuel = () => {
  try {
    if (socket.connected) {

      if (duel.toId !== whoami?.whoami || !duel?.beRequested) return;

      const messageDataDto : MessageDataDto = {
        timeStamp: new Date(),
        //author: `%${whoami?.whoami}` as string,
        scope: `%${duel.fromId}`,
        content: "accept_duel",
      }
      console.log("emit accept_duel", messageDataDto);
      socket?.emit("accept_duel", messageDataDto);
    }
  } catch (err) {console.log("handleAcceptDuel", err)};
}

const handleRejectDuel = () => {
  try {
    if (socket.connected) {

      if (duel.toId !== whoami?.whoami || !duel?.beRequested) return;

      const messageDataDto : MessageDataDto = {
        timeStamp: new Date(),
        //author: `%${whoami?.whoami}` as string,
        scope: `%${duel.fromId}`,
        content: "reject_duel",
      }
      console.log("emit reject_duel", messageDataDto);
      socket?.emit("reject_duel", messageDataDto);
    }
  } catch (err) {console.log("handleRejectDuel", err)};
}

/*
const handleGoToGame = () => {
  try {
    if (socket.connected) {

      if (duel.toId !== whoami?.whoami || !duel?.beRequested) return;
      if (!duel.gameReady) return;

      //if fromId and toId are already joined in the game(roomId)
      //set game active
      if (duel.roomId !== undefined) {
        setRoomId(duel.roomId);
        router.push("/pong");
      }


      const messageDataDto : MessageDataDto = {
        timeStamp: new Date(),
        //author: `%${whoami?.whoami}` as string,
        scope: `%${duel.fromId}`,
        content: "reject_duel",
      }
      console.log("emit reject_duel", messageDataDto);
      socket?.emit("reject_duel", messageDataDto);
    }
  } catch (err) {console.log("handleRejectDuel", err)};
}
*/

/*
          data-tooltip-target="tooltip-default"
          type="button"

        <div id="tooltip-default" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
            Tooltip content
            <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
*/

return (<div className={`bg-${connected?"blue":"red"}-100 p-4 min-w-max`}>
    <div className="flex gap-2">
      <Button.Group>

        <Dropdown
         label={ballSpeed+'x'}
         pill={true}
         color="light"
         size="md"
         arrowIcon={true}
         inline={false}
         disabled={onGame || onGameToast}
         >
           {onGame ? null : <div>
          <Dropdown.Item key={'1x'} onClick={()=>setBallSpeed(GameMode.normal)}>1x
          </Dropdown.Item>

          <Dropdown.Item key={'3x'} onClick={()=>setBallSpeed(GameMode.speedy)}>3x
          </Dropdown.Item>
          </div>}
        </Dropdown>
        <Button
          color={match?.request ? 'warning':'light'}
          onClick={handleRequestMatch}
          disabled={onGame || onGameToast || duel?.request}
        >
          {match?.request ? '매칭 신청중' : '매칭 신청'}
        </Button>

        <Dropdown
         label={duel?.request ? '결투 신청중' : '결투 신청'}
         pill={true}
         color={duel?.request ? 'warning':'light'}
         size="md"
         arrowIcon={true}
         inline={false}
         disabled={onGame || onGameToast || match?.request}
         >

          {onGame || onGameToast || match?.request ? null : MapUtils.toArray(users).filter(user=>user.isOnline && user.login !== whoami?.whoami).map(user=>{
            return (<Dropdown.Item
              key={user.login}
              onClick={()=>handleRequestDuel(user.login)}>

             <UserListItemContent upperText={user.nickname} lowerText= {user.login}/>

            </Dropdown.Item>)
          })}

        </Dropdown>

        <Button
          color={duel?.beRequested ? 'success':'light'}
          disabled={onGame || onGameToast || !duel?.beRequested}
          onClick={handleAcceptDuel}
        >
          허용
        </Button>
        <Button
          color={duel?.beRequested ? 'failure':'light'}
          disabled={onGame || onGameToast || !duel?.beRequested}
          onClick={handleRejectDuel}
        >
          거절
        </Button>
      </Button.Group>


    </div>
  </div>);
}

export default PongButtons;
