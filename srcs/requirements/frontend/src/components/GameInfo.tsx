import {RecoilState, useRecoilState, useRecoilValue } from "recoil";
import { isJoined } from "../recoil/gameFn";
import { currentGameRoomIdAtom, gameSelector } from "../recoil/gameState";
import { GameRoomDto } from "../recoil/gameType";
import { whoamiAtom } from "../recoil/whoamiState";
import GameList from "./GameList";
import GUserList from "./GUserList";

const GameInfo: React.FC = () => {

  const whoami = useRecoilValue(whoamiAtom);

  const [gameRoomId] = useRecoilState(currentGameRoomIdAtom);
  const game = useRecoilValue(gameSelector(gameRoomId) as RecoilState<GameRoomDto>);


  return (<div>

    {gameRoomId === 0  ? <GameList/> :
      isJoined(whoami?.whoami!, game!) ? <div> <GUserList/>  </div> : <GameList/>}

  </div>);
}
export default GameInfo;

/*
    <GameList/>
    <GUserList/>

    {gameRoomId === 0 ? <GameList/> :
      isJoined(whoami?.whoami!, game!) ? <GUserList/> : <GameList/>}
*/

/*
const GameCommandsTest: React.FC = () => {

  const socket = useContext(SocketContext);
  const [roomId] = useRecoilState(currentGameRoomIdAtom);

  return (<div>

    <Dropdown
      label="Game Commands Test"
      color="light"
      inline={false}
    >

      <Dropdown.Header>
        <span className="block text-sm">roomId:{roomId || 'not selected'}</span>

      </Dropdown.Header>


      <Dropdown.Item onClick={()=>{
        try {
          if (socket.connected) {
            console.log('emit cancel_duel', null);
            socket?.emit("cancel_duel", null);
          }
        } catch (err) { console.log("handleCancelDuel", err); }
      }}>
        cancel_duel
      </Dropdown.Item>

      <Dropdown.Item onClick={()=>{
        try {
          if (socket.connected) {
            console.log('emit reject_duel', null);
            socket?.emit("reject_duel", null);
          }
        } catch (err) { console.log("handleRejectDuel", err); }
      }}>
        reject_duel
      </Dropdown.Item>


      <Dropdown.Item onClick={()=>{
        try {
          if (socket.connected) {
            console.log('emit accept_duel', null);
            socket?.emit("accept_duel", null);
          }
        } catch (err) { console.log("handleAcceptDuel", err); }
      }}>
        accept_duel
      </Dropdown.Item>



      <Dropdown.Item onClick={()=>{
        try {
          if (socket.connected) {
            console.log('emit request_match', null);
            socket?.emit("request_match", null);
          }
        } catch (err) { console.log("handleRequestMatch", err); }
      }}>
        request_match
      </Dropdown.Item>


      <Dropdown.Item onClick={()=>{
        try {
          if (socket.connected) {
            console.log('emit cancel_request_match', null);
            socket?.emit("cancel_request_match", null);
          }
        } catch (err) { console.log("handleCancelRequestMatch", err); }
      }}>
        cancel_request_match
      </Dropdown.Item>




    </Dropdown>


  </div>);
}
*/
