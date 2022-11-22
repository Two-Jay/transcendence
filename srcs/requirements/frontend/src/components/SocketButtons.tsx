import { Button } from "flowbite-react";
import { useContext } from "react";
import { HiRefresh } from "react-icons/hi";
import { useRecoilState, useSetRecoilState } from "recoil";
import { SocketContext } from "../context/SocketContext";
import { currentChatRoomIdAtom } from "../recoil/chatState";
import { socketConnectedAtom } from "../recoil/socketState";
import { Tooltip } from "flowbite-react";

const SocketButtons: React.FC = () => {

  const socket = useContext(SocketContext);
  const [connected, setConnected] = useRecoilState(socketConnectedAtom);
  const setChatRoomId = useSetRecoilState(currentChatRoomIdAtom);

  const updateSocket = async (time: number, bOpen: boolean) => {
    console.log("===0000", bOpen);
    try {
      //return new Promise ((resolve, reject) => {
      console.log("===", bOpen);

      if (bOpen != socket.connected) {
        bOpen && socket.disconnected ? socket.open() : socket.close();
        //bOpen? socket?.emit("welcome_kit", null) : null;

        setConnected(socket.connected);
        await new Promise(resolve => {
          setTimeout(resolve, time);
          return resolve;
        })
          .then(()=>{
            if (connected != socket.connected) {
              //work instead of _connected temporarily
              setConnected(socket.connected);
              //connectedRefresh();
              console.log("updateSocket", "connected", connected, "socket", socket.connected, "bOpen", bOpen);
            }
          });
      } else {
        console.log('already updated checked ok');
        setConnected(()=>bOpen);
      }
    } catch(err) { console.log("updateSocket-SocketOnOff", err); }
  }

  const handleOpen = () => {
    setChatRoomId('');
    updateSocket(150, true);
      //.then((value) => console.log(value));
  }

  const handleClose = () => {
    setChatRoomId('');
    updateSocket(150, false);
      //.then((value) => console.log(value));
  }



  const handleWelcomeKit = () => {
    if (socket?.connected) {
      console.log("handleGetWelcomeKit emits welcome_kit");
      socket?.emit("welcome_kit", null);
    }
  }


return (<div className={`bg-${connected?"blue":"red"}-100 p-4 min-w-max`}>
    <div className="flex gap-2">
      <Tooltip  content={`socket.id=${socket?.id}`} style="auto">
      <Button
        pill={true}
        color={socket?.connected ? 'success':'light'}
        onClick={handleOpen}
      >
        {socket?.connected ? "ON" : "on"}
      </Button></Tooltip>


      <Button
        pill={true}
        color={!socket?.connected ? 'failure':'light'}
        onClick={handleClose}
      >
        {!socket?.connected ? "OFF" : "off"}
      </Button>

      <Button
        pill={true}
        disabled={!socket?.connected}
        color={!socket?.connected ? 'failure':'light'}
        onClick={handleWelcomeKit}
      >
        <HiRefresh className="h-5 w-5"/>
      </Button>

    </div>
  </div>);
}

export default SocketButtons;
