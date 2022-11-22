import React, { useEffect } from "react";
import { useRouter } from 'next/router'
import { useRecoilValue } from "recoil";
import { accessLevelAtom } from "../recoil/whoamiState";
import Layout, { Section } from "../components/Layout";
import { NextPage } from "next";
import Nickname from "../components/Nickname";
import SocketButtons from "../components/SocketButtons";
import SendMessage from "../components/SendMessage";
import Messages from "../components/Messages";
import PongButtons from "../components/PongButtons";
import ChatInfo from "../components/ChatInfo";
import { LEVEL3 } from "../recoil/whoamiType";

//let socket: Socket;



const Chat: NextPage = () => {
  const router = useRouter();
  const accessLevel = useRecoilValue(accessLevelAtom);

  useEffect(()=>{
    if (accessLevel.bitwise < LEVEL3) {
      router.push("/");
    }
  }, [accessLevel]);







  return (
    <Layout title={"chat - trans_front"}>
      {accessLevel.bitwise < LEVEL3 ? null : <ChatPage />}
    </Layout>
  );
}
export default Chat;

/*


*/


const ChatPage: React.FC = () => {
  return (
    <div className="">
      <Section title="Chat" tsize={2}>
      <div>

        <div className="flex items-stretch bg-blue-100">

          <div className="flex flex-col w-80">
            <Nickname/>
            <ChatInfo/>
          </div>

          <div className="flex flex-col">
            <div className="flex">
              <SocketButtons />
              <PongButtons/>
            </div>
            <Messages height={80}/>
            <SendMessage/>
          </div>
        </div>


      </div>

      </Section>
    </div>
  );
}
