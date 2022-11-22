import type { NextPage } from "next";
import { useRouter } from 'next/router'
//import { ReactNode } from "react";
//import type { NextPage } from 'next'
import { useRecoilState, useRecoilValue } from "recoil";
//import { indexQueryState } from "../recoil/indexState";
//import { useEffect } from "react";
//import { getCookie } from 'cookies-next';
import { useContext, useEffect } from "react";
import { Checkbox, Label, Textarea, TextInput } from "flowbite-react";
import { whoamiAtom, whoamiDetailAtom, accessLevelAtom} from "../recoil/whoamiState";
import Layout, { Section } from "../components/Layout";
import { socketWelcomeKitAtom } from "../recoil/socketState";
import { LEVEL0, LEVEL1, LEVEL2, LEVEL3 } from "../recoil/whoamiType";
import { SocketContext } from "../context/SocketContext";
//import { useRecoilCacheRefresh } from "../recoil/recoilUtils";

//export default function Index(): JSX.Element {
const Index: NextPage = () => {
  const router = useRouter();
  const socket = useContext(SocketContext);

  // const bWhoami = useRecoilValue(bWhoamiAtom);
  // const tfaEnable = useRecoilValue(tfaEnableSelector);
  // const online = useRecoilValue(onlineSelector);
  const accessLevel = useRecoilValue(accessLevelAtom);
  //const accessLevelRefresh = useRecoilCacheRefresh(accessLevelAtom);

  useEffect(()=>{
    //whoamiRefresher();
    //socketInitLocal();
    //accessLevelRefresh();

    return () => {
      //whoamiRefresher();
      //socketFinalLocal();
    }
  }, []);
  /*
  const socketInitLocal = async () => {
    console.log("socketInitLocal-INDEX");
    // socket.emit("_connect")
    socket.on("_connect", _handleConnect);
    // socket.emit("_connect", handleConnect);
    socket.on("_disconnect", _handleDisconnect);
    // if (accessLevel.bitwise > LEVEL1  && socket.disconnected)
    //   socket.open();
  };

  const socketFinalLocal = async() => {
    console.log("socketFinalLocal-INDEX")
    socket.off("_connect", _handleConnect);
    socket.off("_disconnect", _handleDisconnect);
  }

  const _handleConnect = useCallback((msg : MessageDataDto)=>{
    try {
      console.log('=====> INDEX from server handleConnect');
      //console.log(socket);

      //setConnected(true);

    } catch(err) { console.log("_handleConnect-index", err); }

  }, []);

  const _handleDisconnect = useCallback((msg: MessageDataDto)=>{
    try {
      console.log('=====> INDEX from server handleDisconnect');
      setConnected(false);
      //connectedRefresh();

    } catch(err) { console.log("_handleDisconnect-index", err); }

  }, []);
  */

  useEffect(()=>{
    console.log("index -------- in useEffect[accessLevel]", accessLevel.levelStr)
    if(accessLevel.bitwise === LEVEL1){
      console.log("go to /tfa after login -------- in")
      router.push("/tfa");
    }


    if (accessLevel.bitwise >= LEVEL2  && socket.disconnected) {
      socket.open();
      console.log("====socket.open()===")
    }

    if(accessLevel.bitwise === LEVEL2){
      console.log("go to /profile after login -------- in")
      router.push("/profile");
    }


    return(()=>{
      //accessLevelRefresh();
    });
  }, []);

/*
  if (accessLevel.bitwise > LEVEL0) {
    //console.log("hello")
    if (socket.disconnected && !welcomeKit) {
      //socket.open();
      console.log("socket.disconnected && !welcomeKit");
    } else if (socket.connected && !welcomeKit) {
      console.log("socket.connected && !welcomeKit");
      //socket.close().open();
    } else if (socket.connected) {
      //console.log("index connected true setting", connected, socket.connected)
      //setConnected(true);
    }
  }
*/

  return (
    <Layout title="trans_front">
      {accessLevel.bitwise >= LEVEL3 ? <IndexPage /> : null}
    </Layout>
  );
}
export default Index;



const IndexPage: React.FC = () => {

  return (
    <div className="">
      <Section title = "Home" tsize={2}>
      </Section>

      <Section title = "Whoami Check (temp)" tsize={1}>
        <WhoamiComponent/>
      </Section>
    </div>
  );
}

/*
      <Section title = "front 오늘의 할일" tsize={1}>
        <FrontTodoList/>
      </Section>
*/

const WhoamiComponent: React.FC = () => {
  const whoami = useRecoilValue(whoamiAtom);
  const whoamiDetail = useRecoilValue(whoamiDetailAtom);
  //const whoamiRefresher = useRecoilCacheRefresh(whoamiAtom);
  //const whoamiDetailRefresher = useRecoilCacheRefresh(whoamiDetailAtom);

  const accessLevel = useRecoilValue(accessLevelAtom);

  //const [connected, setConnected] = useRecoilState(socketConnectedAtom);
  const [welcomeKit, _0] = useRecoilState(socketWelcomeKitAtom);

  // useEffect(()=>{
  //   //whoamiRefresher();
  //   //whoamiDetailRefresher();

  //   return () => {}
  // }, []);

  return (<div className="mb-6">
    <div className="flex flex-col space-y-4">
    <div className="flex gap-2">
      <Checkbox id="Whoami" disabled={true} checked={accessLevel.bitwise > LEVEL0} />
      <Label>whoami</Label>
    </div>
    <TextInput disabled
      placeholder={JSON.stringify(whoami)}
    />
    <Label>whoamiDetail</Label>
    <Textarea
      disabled
      rows={2}
      placeholder={JSON.stringify(whoamiDetail)}
    />

    <Label>welcomeKit</Label>
    <Textarea
      disabled
      rows={5}
      placeholder={JSON.stringify(welcomeKit)}
    />

    </div>
    </div>);
}

