import React, { useContext, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Button, Toast } from "flowbite-react";
import { HiFire, HiCheck, HiX, HiExclamation} from "react-icons/hi";
import { FaTelegramPlane } from "react-icons/fa";
import { RiPingPongFill } from "react-icons/ri";
import { toastMapAtom } from "../recoil/toastState";
import { FToast, ToastButtonType, ToastType } from "../recoil/toastType";
import { useRouter } from "next/router";
import { accessLevelAtom } from "../recoil/whoamiState";
import { AVATAR_CHECK, LEVEL0, LEVEL1, NICKNAME_CHECK } from "../recoil/whoamiType";
import GameListener from "./GameListener";
import { SocketContext } from "../context/SocketContext";
import ChatListener from "./ChatListener";
import { MapUtils } from "../recoil/mapUtils";

type ToastItemProps = {

  toast: FToast;
}

const ToastList: React.FC = () => {
  const router = useRouter();
  const accessLevel = useRecoilValue(accessLevelAtom);

  const socket = useContext(SocketContext);
  const [toasts, setToasts] = useRecoilState(toastMapAtom);
  const [_, setCalledPush] = useState(false);

  useEffect(()=>{
    ////////////////////////////
    //socket.open()
    ///////////////////////////
    // if (accessLevel.bitwise >= LEVEL1  && socket.disconnected) {
    //   socket.open();
    //   console.log("====socket.open()===")
    // }
  },[]);

//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   toast finishTime check                                           /////
/////                                                                    /////
//////////////////////////////////////////////////////////////////////////////

  useEffect(()=>{
    const intervalID = setInterval(()=>{
      //setConnected(socket.connected);
      eatToast();
    }, 1000);
    return ()=>clearInterval(intervalID);
  }, [eatToast]);

  function eatToast() {
    if (toasts.size > 0) {
      setToasts((curVal)=>{
        const newVal = MapUtils.filter(curVal, (_, value) =>value.isValid());
        const timeOut = MapUtils.filter(curVal, (_, value) => !value.isValid());

        if (timeOut) {
          timeOut.forEach(e => {
            if (e.onTimeout)
              e.onTimeout();
          });
        }

        return newVal;
      });
    }
  };

//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   toast nickname and avatar set and delete                         /////
/////                                                                    /////
//////////////////////////////////////////////////////////////////////////////


useEffect(()=>{
  try {
    //make a function for add and remove a toast later
    if ((accessLevel.bitwise == LEVEL0)) {
      setToasts((curVal)=>{
        const toast = new FToast("%loginFirst%", ToastType.HiFire,  "login first", 3600, ToastButtonType.NoButton);
        return MapUtils.set(curVal, toast.id, toast);
      });

      //push only once
      let calledPushLatest;
      setCalledPush(latest => {
        calledPushLatest = latest;
        return latest;
      })

      if(calledPushLatest) return;
      setCalledPush(true);
      router.push("/login");

    } else {
      setToasts(curVal=>MapUtils.delete(curVal, "%loginFirst%"));
    }

    if ((socket.connected && accessLevel.bitwise > LEVEL1) &&
        (!(accessLevel.bitwise & NICKNAME_CHECK) || !(accessLevel.bitwise & AVATAR_CHECK))
    ) {
      setToasts((curVal)=>{
        const toast = new FToast("%setNicknameAvatar%", ToastType.HiCheck, "go to Profile, and set your nickname and avatar", 3600, ToastButtonType.NoButton);
        return MapUtils.set(curVal, toast.id, toast);
      });

      //sometiems, accessLevel query fails, so when no nickname and avatar, then accessLevelRefresh here to double-check
      //back to _connect, it works properly on the cluster computers
      //console.log("===accessLevelRefresh===");
      //accessLevelRefresh();
    } else {
      setToasts(curVal=>MapUtils.delete(curVal, '%setNicknameAvatar%'));
    }

  } catch(err) {console.log("ToastList-useEffect([accessLevel])", err)}
}, [accessLevel]);

return (<div className="grid grid-cols-3 gap-y-2">
  <ChatListener/>
  <GameListener/>
  {MapUtils.toArray(toasts).map(toast=>{
    return (<ToastItem toast={toast} key={toast.id}/>);
  })}

  </div>);
}
export default ToastList;

//return (<div className="grid grid-cols-3">

const ToastItem: React.FC<ToastItemProps> = ({toast}) => {
  const setToasts = useSetRecoilState(toastMapAtom);

  const handleClickButton = () => {
    try {
      setToasts(curVal=>{
        //const newVal = MapUtils.filter(curVal, (_, value) => value.id !== toast.id);
        const newVal = MapUtils.delete(curVal, toast.id);
        return newVal;
      });

      if (toast.onClick) toast.onClick();

    } catch (err) {console.log("handleDeleteToast", err); }
  };

  return (<div className="" >
    <Toast> <div className="flex items-center">
      {(toast.type === ToastType.HiFire)?
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200">
          <HiFire className="h-5 w-5" />
        </div> : null}

      {(toast.type === ToastType.HiCheck)?
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
          <HiCheck className="h-5 w-5" />
        </div>   : null}

      {(toast.type === ToastType.HiX)?
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
          <HiX className="h-5 w-5" />
        </div>   : null}

      {(toast.type === ToastType.HiExclamation)?
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
          <HiExclamation className="h-5 w-5" />
        </div> : null}

      {(toast.type === ToastType.FaTelegramPlane)?
        <div><FaTelegramPlane className="h-5 w-5 text-blue-600 dark:text-blue-500" />
        </div>: null}


      {(toast.type === ToastType.RiPingPongFill)?
        <div><RiPingPongFill className="" />
        </div>: null}


      <div className="ml-3 text-sm font-normal mr-8">
        {toast?.msgout}
      </div>

      <div className="">
      { (toast.buttonType === ToastButtonType.X) || (toast.buttonType === ToastButtonType.O) ? //if duration is more than 1 hour, then no x button
        <Button size="xs" color="light" onClick={handleClickButton}>
          {toast.buttonType}
        </Button>
      : null}

      {(toast.buttonType === ToastButtonType.Pong) ?
        <Button size="xs" color="warning" onClick={handleClickButton}>
          <RiPingPongFill/>
        </Button>
      : null}
      </div>
    </div></Toast>
  </div>);
  }


/*
  button colors https://flowbite-react.com/buttons


<Toast.Toggle />

*/
