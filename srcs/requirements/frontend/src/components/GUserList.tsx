import { Avatar, Button, ListGroup } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { RecoilState, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { SocketContext } from "../context/SocketContext";
import { isJoined, isJoinedPlayer } from "../recoil/gameFn";
import { currentGameRoomIdAtom, gameMapAtom, gameSelector } from "../recoil/gameState";
import { socketConnectedAtom } from "../recoil/socketState";
import { whoamiAtom } from "../recoil/whoamiState";
import { GameRoomDto } from "../recoil/gameType";
import { GameMapUtils, MapUtils } from "../recoil/mapUtils";
import { userMapAtom } from "../recoil/userState";
import { useRouter } from "next/router";


const GUserList: React.FC = () => {

  const router = useRouter();
  const whoami = useRecoilValue(whoamiAtom);

  const socket = useContext(SocketContext);

  const setGames = useSetRecoilState(gameMapAtom);
  const [gameRoomId, _0] = useRecoilState(currentGameRoomIdAtom);
  const game = useRecoilValue(gameSelector(gameRoomId) as RecoilState<GameRoomDto>);

  const [connected, _1] = useRecoilState(socketConnectedAtom);
  const [selectedUser, setSelectedUser] = useState("");
  const users = useRecoilValue(userMapAtom);



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



  const handleLeaveGame = async () => {
    try {
      if (socket.connected) {


        //if player, then emit give up and remove the game room from the gameMap
        if (game.playerSocketId.includes(socket.id) ) {
          console.log('emit giveup --->', game);
          socket.emit("giveup", game)
          setGames(curVal=>MapUtils.delete(curVal, game.roomId)); //exclusively done here
        } else { //else observer, then emit leave
          console.log('emit leave_game --->', game);
          socket?.emit("leave_game", game);

          const observerMap = new Map<string, string>();
          setGames(curVal=>GameMapUtils.set_attr(curVal, gameRoomId, 'observer', observerMap));

        }



      }
    } catch (err) { console.log("handleLeaveGame", err); }
  };

  return (
  <div className={`bg-${connected?"blue":"red"}-100 p-4 min-w-min`}>
    <h3 className="py-1 text-center bg-gray-500 text-white font-bold rounded-t-lg">User List ({game?.player?.length}) </h3>

    <div className=" h-72 overflow-y-auto">
      <div className="w-full h-full">
      <ListGroup>

          { game?.player?.map( (p) => {
            return (
              <ListGroup.Item
                      key={p}
                      active={p===selectedUser}
                      onClick={() => {
                        setSelectedUser(p);
                    }}
              >
                  <div className="flex w-full gap-4  items-center">

                  <Avatar
                  alt={users.get(p)?.avatar}
                  img = {users.get(p)?.avatarImgSrc}
                  status={isJoinedPlayer(p, game)? "away" : undefined} statusPosition="top-right"
                  rounded={true}
                  >
                    <div className="text-left space-y-1 font-medium dark:text-white">
                      <div>
                        {users.get(p)?.nickname}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {p}
                      </div>
                    </div>
                  </Avatar>

                </div>
              </ListGroup.Item>
            );
            })
          }


      </ListGroup>
      </div>
    </div>



    <div className="flex pt-4 gap-2 ">


      <Button type="button" color="light" pill={true} size={'sm'}
        onClick={handleLeaveGame} disabled={!connected || !isJoined(whoami?.whoami!, game!)}
      >
        Leave
      </Button>



      {selectedUser == null || selectedUser == '' || !users.has(selectedUser) || selectedUser === whoami?.whoami ? null :
      <Button type="button" color="light" pill={true} size={'sm'}
        onClick={()=>{
          router.push('/users/'+selectedUser);
        }}
      >
        Profile
      </Button>
      }



    </div>



  </div>
  );
}
export default GUserList;

/*



*/
