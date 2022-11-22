// import { useCallback, useContext, useEffect, useState } from "react";
import { useCallback, useContext, useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { SocketContext } from "../context/SocketContext";
// import { socketConnectedAtom, socketWelcomeKitAtom } from "../recoil/socketState";
import { MessageDataDto } from "../recoil/chatType";
import {  whoamiAtom } from "../recoil/whoamiState";
import { duelAtom, currentGameRoomIdAtom, gameMapAtom, matchAtom, onGameToastAtom } from "../recoil/gameState";
// import { useRouter } from "next/router";
import { GamePlayDto, GameRoomDto } from "../recoil/gameType";
import { nanoid } from 'nanoid';
import { FToast, ToastButtonType, ToastType } from "../recoil/toastType";
import { toastMapAtom } from "../recoil/toastState";
// import { GameMapUtils, MapUtils } from "../recoil/mapUtils";
import { GameMapUtils, MapUtils } from "../recoil/mapUtils";
import { useRouter } from "next/router";
import { useRecoilCacheRefresh } from "../recoil/recoilUtils";
// import { useRecoilCacheRefresh } from "../recoil/recoilUtils";

const GameListener : React.FC = () => {

  const router = useRouter();
  const socket = useContext(SocketContext);
  // const [connected, setConnected] = useRecoilState(socketConnectedAtom);
  // const connectedRefresh = useRecoilCacheRefresh(socketConnectedAtom);
  // const [welcomeKit, setWelcomeKit] = useRecoilState(socketWelcomeKitAtom);
  // const [requestDuel, setRequestDuel] = useState(false);
  const whoami = useRecoilValue(whoamiAtom);
  const [duel, setDuel] = useRecoilState(duelAtom);
  const resetDuel = useResetRecoilState(duelAtom);
  const duelRefresh = useRecoilCacheRefresh(duelAtom);

  // const [match, setMatch] = useRecoilState(matchAtom);
  const setMatch = useSetRecoilState(matchAtom);
  const resetMatch = useResetRecoilState(matchAtom);


  // const [roomId, setRoomId] = useRecoilState(currentGameRoomIdAtom);
  // const [games, setGames] = useRecoilState(gameMapAtom);
  const setGameRoomId = useSetRecoilState(currentGameRoomIdAtom);
  const gameRoomIdRefresh = useRecoilCacheRefresh(currentGameRoomIdAtom);
  const setGames = useSetRecoilState(gameMapAtom);

  //const updateGames = useSetRecoilState(updateGamesSelector);

  // const [toasts, setToasts] = useRecoilState(toastMapAtom);
  const setToasts = useSetRecoilState(toastMapAtom);
  //const [toastMap, setToastMap] = useRecoilState(toastMapAtom);
  const [_, setOnGameToast] = useRecoilState(onGameToastAtom);

  useEffect(() => {
    socketInitLocal();
    return ()=>{
      socketFinalLocal();
    }
  }, [socket]);

  const socketInitLocal = async () => {
    console.log("socketInitLocal-GameListener");
    socket?.on("_create_game", _handleCreateGame);
    socket?.on("_my_game", _handleMyGame);
    socket?.on("_join_game", _handleJoinGame);
    //socket?.on("_move_paddle", _handleMovePaddle);
    socket?.on("_end_game", _handleEndGame);

    socket?.on("_duel", _handleRequestDuel);
    socket?.on("_cancel_duel", _handleCancelDuel);
    socket?.on("_accept_duel", _handleAcceptDuel);
    socket?.on("_reject_duel", _handleRejectDuel);


    socket?.on("_request_match", _handleRequestMatch);
    socket?.on("_cancel_request_match", _handleCancelRequestMatch);
    socket?.on("_observe_game", _handleObserveGame);
    socket?.on("_leave_game", _handleLeaveGame);

    socket?.on('_on_game', _handleOnGame);

  };

  const socketFinalLocal = async() => {
    console.log("socketFinalLocal-GameListener")
    socket?.off("_my_game", _handleMyGame);
    socket?.off("_create_game", _handleCreateGame);
    socket?.off("_join_game", _handleJoinGame);
    // socket?.off("_move_paddle", _handleMovePaddle);
    socket?.off("_end_game", _handleEndGame);

    socket?.off("_duel", _handleRequestDuel);
    socket?.off("_cancel_duel", _handleCancelDuel);
    socket?.off("_accept_duel", _handleAcceptDuel);
    socket?.off("_reject_duel", _handleRejectDuel);

    socket?.off("_request_match", _handleRequestMatch);
    socket?.off("_cancel_request_match", _handleCancelRequestMatch);
    socket?.off("_observe_game", _handleObserveGame);
    socket?.off("_leave_game", _handleLeaveGame);

    socket?.off('_on_game', _handleOnGame);
  }

  const _handleCreateGame = useCallback((msg: GameRoomDto)=>{
    try {

      console.log('=====> from server _handleCreateGame-GameListener', msg);

      setToasts((curVal)=>{
        const toast = new FToast('%JoinGameAsPlayer'+msg.roomId+'%', ToastType.HiFire, msg.title + " in game " + msg.roomId, 20, ToastButtonType.X);
        return MapUtils.set(curVal, toast.id, toast);
      })

      //const game = new GameRoomDto(msg.roomId, msg.title, msg.player, msg.status);
      setGames(curVal=>MapUtils.set(curVal, msg.roomId, msg));

    } catch (err) { console.log("_handleCreateGame-GameListener", err);}

  }, []);

  //to the player only
  const _handleMyGame = useCallback((msg: GamePlayDto)=>{
    try {
      console.log('=====> from server _handleMyGame-GameListener', msg);

      // const gamePlayDto = msg as GamePlayDto;
      // const gamePlayDto = gameRoomDto.status;
      window.localStorage.setItem(socket.id, JSON.stringify(msg));

      setOnGameToast(true);
      setTimeout(
        function() {
          setOnGameToast(false);
        }, 20000);

      setToasts((curVal)=>{
        const toast = new FToast(nanoid(), ToastType.RiPingPongFill, "You are the player. Let's join to the game " + msg.roomId, 20, ToastButtonType.Pong,
          // () => { socket.emit('join_game', msg.status) },
          () => {
            socket.emit('join_game', msg);
            console.log("!!!!!!!!!!!!!!!!!!!!!WILL JOIN GAME!!!!!!!!!!!!!!!!");
          },
          // () => { socket.emit('giveup', msg.status) },
          () => {
            //socket.emit('giveup', msg);
            //console.log("!!!!!!!!!!!!!!!!!!!!!WILL GIVEUP!!!!!!!!!!!!!!!!");
          },
          );
        return MapUtils.set(curVal, toast.id, toast);
      })

      resetMatch();
      resetDuel();





    } catch (err) { console.log("_handleMyGame-GameListener", err);}
  }, []);

  const _handleObserveGame = useCallback((msg: GameRoomDto)=>{
    try {
      console.log('=====> from server _handleObserveGame-GameListener', msg);
      //console.log('gameRoomDto:', msg);
      setGames(curVal=>MapUtils.set(curVal, msg.roomId, msg));



    } catch(err) { console.log("_handleObserveGame-GameListener", err); }
  }, []);




  const _handleJoinGame = useCallback((msg: GameRoomDto)=>{
    try {

      console.log('=====> from server _handleJoinGame-GameListener', msg);


      //if (msg.playerSocketId.includes(socket.id)) {
        setGames(curVal=>MapUtils.set(curVal, msg.roomId, msg));
      //  console.log("=== I am in the game ===", whoami?.whoami);
      //}

      if (router.pathname !== "/pong")
        router.push('/pong');

      setGameRoomId(msg.roomId!);


/*
      if (msg.author ===  '%SYSTEM%') { }
*/
    } catch (err) { console.log("_handleJoinGame-GameListener", err);}

  }, []);


  const _handleLeaveGame = useCallback((msg: MessageDataDto)=>{
    try {
      console.log('=====> from server _handleLeaveGame-GameListener', msg);
      console.log('author, scope, content:', msg.author, msg.scope, msg.content);
      window.localStorage.removeItem(socket.id)


      //author: '%SYSTEM%', scope: '#10', content: 'seongcho'

      if (msg.content === whoami?.whoami && msg.option === socket.id) {
        //empty player
        setGames(curVal=>GameMapUtils.set_attr(curVal, Number(msg.scope?.slice(1)), "player", []));
        //game.observerCount

        setGameRoomId(0);
        gameRoomIdRefresh();
      }

      //second _IDetail update is not working, so refresh when leaving the room here just for now
      console.log("welcome_kit emit--->")
      socket?.emit("welcome_kit", null);


    } catch(err) { console.log("_handleLeaveGame-GameListener", err); }
  }, []);

  // const _handleMovePaddle = useCallback((msg: GamePlayDto)=>{
  //   // try {
  //   //   console.log('=====> from server _handleMovePaddle-GameListener', msg);
  //   //   window.localStorage.setItem(socket.id, JSON.stringify(msg));
  //   // } catch (err) { console.log("_handleJoinGame-GameListener", err);}

  // }, []);

  const _handleEndGame = useCallback((msg: MessageDataDto)=>{

    // author: '%SYSTEM%'
    // scope: #roomId
    // content: winner_login_name

    try {
      console.log('=====> from server _handleEndGame-GameListener', msg);
      //{author: '%SYSTEM%', scope: '#1', content: 'indivisibilibus@gmail.com'}

      setToasts(curVal=>{
        const toast = new FToast("gameWinner/"+msg.scope?.slice(1),
          ToastType.HiFire, "The Game " +  msg.scope?.slice(1) + " is over! The winner is " + msg.content, 20);
        return MapUtils.set(curVal, toast.id, toast);
      })

      //remove the game room
      setGames(curVal=>MapUtils.delete(curVal, Number(msg.scope?.slice(1))));
      // window.localStorage.setItem(socket.id, JSON.stringify(msg));

      console.log("welcome_kit emit--->")
      socket?.emit("welcome_kit", null);

    } catch (err) { console.log("_handleEndGame-GameListener", err);}

  }, []);

  const _handleOnGame = useCallback((msg: GamePlayDto)=>{
    try {
      //console.log('=====> from server _handleOnGame-GameListener', msg);
      window.localStorage.setItem(socket.id, JSON.stringify(msg));
    } catch(err) { console.log("_handleOnGame-GameListener", err); }
  }, []);


  const _handleRequestDuel = useCallback((msg: MessageDataDto)=>{
    try{
      console.log('=====> from server _handleRequestDuel-GameListener', msg);


      if (msg.content !== "request_duel") return;
      //if (msg.author !== whoami?.whoami && msg.scope !== whoami?.whoami) return;

      if (msg.option == null || msg.option === true || msg.option === 1 || msg.option === 3) {
        setDuel((curDuel)=>{
          const newDuel = {...curDuel};
          newDuel.fromId = msg.author?.slice(1) as string;
          newDuel.toId = msg.scope?.slice(1) as string;
          if (msg.author?.slice(1) === whoami?.whoami)
            newDuel.request = true;
          else if (msg.scope?.slice(1) === whoami?.whoami)
            newDuel.beRequested = true;
          newDuel.timeStamp = new Date();

          console.log("---_handleRequestDuel---", newDuel)
          return newDuel;
        })

        setToasts(curVal=>{
          const message = "requestDuel: from "+ msg.author?.slice(1)+" to  "+msg.scope?.slice(1);
          const toast = new FToast(message, ToastType.HiFire, message, 10);
          return MapUtils.set(curVal, toast.id, toast);
        })


      } else if (msg.option === false) {
        setToasts(curVal=>{
          const toast = new FToast("requestDuelFrom"+whoami?.whoami+"To"+msg.scope?.slice(1),
            ToastType.HiExclamation, "your duel reqequest result: "+ msg.option, 10);
          return MapUtils.set(curVal, toast.id, toast);
        })


        console.log("emit cancel_duel", null);
        socket?.emit("cancel_duel", null);
        resetDuel();

      }

    } catch(err) { console.log("_handleRequestDuel-GameListener", err); }
  }, []);

  const _handleCancelDuel = useCallback((msg: MessageDataDto)=>{
    try{
      console.log('=====> from server _handleCancelDuel-GameListener', msg);

      //if (msg.content !== "cancel_request_duel") return;
      //if (msg.author !== whoami?.whoami && msg.scope !== whoami?.whoami) return;

      //if ((duel.fromId === whoami?.whoami && duel.request) ||
      //    (duel.toId === whoami?.whoami && duel.beRequested))
        resetDuel();

    } catch(err) { console.log("_handleCancelDuel-GameListener", err); }
  }, []);

  const _handleAcceptDuel = useCallback((msg: MessageDataDto)=>{
    try {
      console.log('=====> from server _handleAcceptDuel-GameListener', msg);

      if (msg.content !== "accept_duel") return;
      if (msg.author !== whoami?.whoami && msg.scope !== whoami?.whoami) return;
      if (msg.author !== duel.toId) return;
      if (msg.scope !== duel.fromId) return;

      setDuel((curDuel)=>{
        const newDuel = {...curDuel};
        newDuel.accepted = true;
        newDuel.roomId = 7;//msg.option;
        newDuel.gameReady = true;
        return newDuel;
      })

    } catch(err) { console.log("_handleAcceptDuel-GameListener", err); }
  }, []);

  const _handleRejectDuel = useCallback((msg: MessageDataDto)=>{
    try {
      console.log('=====> from server _handleRejectDuel-GameListener', msg);

      // if (msg.content !== "accept_duel") return;
      // if (msg.author !== whoami?.whoami && msg.scope !== whoami?.whoami) return;
      // if (msg.author !== duel.toId) return;
      // if (msg.scope !== duel.fromId) return;

      //if ((duel.fromId === whoami?.whoami && duel.request) ||
      //    (duel.toId === whoami?.whoami && duel.beRequested)) {
            console.log("emit cancel_duel", null);
            socket?.emit("cancel_duel", null);
            resetDuel();
            duelRefresh();


      //}

    } catch(err) { console.log("_handleRejectDuel-GameListener", err); }
  }, []);

  const _handleRequestMatch = useCallback((msg: GameRoomDto)=>{
    try {
      console.log('=====> from server _handleRequestMatch-GameListener', msg);

      setMatch(curVal=>{
        const newVal = {...curVal};
        newVal.request = true;
        return newVal;
      })

      // 신청 성공했으니, 신청 button을 뭔가 예쁘게 포장.
      // msg는 null임
    } catch(err) { console.log("_handleRequestMatch-GameListener", err); }
  }, []);

  const _handleCancelRequestMatch = useCallback((msg: MessageDataDto)=>{ // any or ?? not decided yet
    try {
      console.log('=====> from server _handleCancelRequestMatch-GameListener', msg);
      console.log('null:', msg);

      setMatch(curVal=>{
        const newVal = {...curVal};
        newVal.request = false;
        return newVal;
      })

    } catch(err) { console.log("_handleCancelRequestMatch-GameListener", err); }
  }, []);






  return (<></>);
}

export default GameListener;
