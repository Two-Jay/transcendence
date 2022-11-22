import { Avatar, Button, Checkbox, ListGroup, Tooltip, } from "flowbite-react";
import { useContext, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SocketContext } from "../context/SocketContext";
import { currentGameRoomIdAtom, gameMapAtom } from "../recoil/gameState";
import { GamePlayDto } from "../recoil/gameType";
import { socketConnectedAtom } from "../recoil/socketState";
import { whoamiAtom } from "../recoil/whoamiState";
import { GameMapUtils, MapUtils } from "../recoil/mapUtils";
import { userMapAtom } from "../recoil/userState";
import { isJoined } from "../recoil/gameFn";
//import Sidebar from "./sidebar";

const GameList: React.FC = () => {

  const whoami = useRecoilValue(whoamiAtom);
  const socket = useContext(SocketContext);
  const [games, setGames] = useRecoilState(gameMapAtom);
  const [gameRoomId, setGameRoomId] = useRecoilState(currentGameRoomIdAtom);
  const [connected] = useRecoilState(socketConnectedAtom);
  const users = useRecoilValue(userMapAtom);


  useEffect(() => {
    try {
      socketInitLocal();

      return ()=>{
        socketFinalLocal();
      }
    } catch (err) { console.log("useEffect-ChatList", err); return;}
  }, [socket]);

  const socketInitLocal = async () => {
    console.log("socketInitLocal-ChatList")

  };

  const socketFinalLocal = async() => {
    console.log("socketFinalLocal-ChatList")
  }


  const handleJoinGame = async () => {
    try {
      if (socket.connected) {

        const gamePlayDto = new GamePlayDto(gameRoomId);
        console.log('emit join_game --->', gamePlayDto);
        socket?.emit("join_game", gamePlayDto);

        const observerMap = new Map<string, string>();
        observerMap.set(whoami?.whoami!, whoami?.whoami!)
        setGames(curVal=>GameMapUtils.set_attr(curVal, gameRoomId, 'observer', observerMap));

      }
    } catch (err) { console.log("handleJoinGame", err); }
  };

/*
  const handleDelete = async () => {
    try {
      if (socket.connected) {

        //listen _delete
        setGames(curVal=>MapUtils.delete(curVal, gameRoomId));
        setGameRoomId(0);
      }

    } catch (err) { console.log("handleDelete", err); }
  };
*/


  return (
  <div className={`bg-${connected?"blue":"red"}-100 p-4 min-w-min`}>
    {/* <h3 className="py-1 text-center bg-gray-500 text-white font-bold rounded-t-lg">Game List ({games.length}) </h3> */}
    <h3 className="py-1 text-center bg-gray-500 text-white font-bold rounded-t-lg">Game List ({games.size}) </h3>

    <div className="h-72 overflow-y-auto">
      <div className="w-full h-full">
      <ListGroup>
          {MapUtils.toArray(games).map((game) => {

              //console.log("whoami", whoami, room.members)

              let joined: boolean = isJoined(whoami?.whoami!, game);

              // if(room.members == undefined || room.members.length < 1)
              //   joined = false;
              // else
              //   joined  = room.members.find((member) => member === whoami?.whoami)? true : false;

              return (
              <ListGroup.Item
                key={game.roomId}
                active={game.roomId===gameRoomId}
                onClick={() => {
                    setGameRoomId(game.roomId);
                }}
              >
              <div className="flex w-full gap-4 justify-between items-center">
                <Tooltip
                    content={`${joined? "joined":"not joined yet"}`}
                    style="auto"
                  >
                <Checkbox
                  id="joined"
                  readOnly
                  checked={joined}/>
                </Tooltip>
                <div className="text-base text-yellow-400 font-normal">
                  {game.roomId}
                </div>
                <div className="flex w-full gap-4 justify-around items-center">
                  <Avatar alt=""
                    img = {users.get(game.player[0]!)?.avatarImgSrc!}
                    statusPosition="top-right" rounded={true}/>
                  <span className="text-base font-normal">VS</span>
                  <Avatar alt={users.get(game.player[1]!)?.avatar!}
                    img = {users.get(game.player[1]!)?.avatarImgSrc!}
                    statusPosition="top-right" rounded={true}/>
                </div>
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
        onClick={handleJoinGame} disabled={!connected || gameRoomId === 0}
      >
        Observe
      </Button>




    </div>



  </div>
  );
}
export default GameList;

/*

    <div className="flex gap-2">

      <div className="w-1/5">

        <TextInput id="room"
          type="text"
          disabled={!connected}
          placeholder={"title"}
          value={gameTitle}
          onChange={(e) => setRoomTitle(e.target.value)}
        />
      </div>

      <Button type="button" color="light"
        onClick={handleCreateGame} disabled={!connected}
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
