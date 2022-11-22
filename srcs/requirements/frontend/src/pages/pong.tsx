
import type { NextPage } from "next";
import React, { useEffect } from "react";
import { useRouter } from 'next/router'
import Layout, { Section } from "../components/Layout";
import PongGame from "../components/PongGame";
import PongButtons from "../components/PongButtons";
import SocketButtons from "../components/SocketButtons";

import { useRecoilValue } from "recoil";
import { accessLevelAtom } from "../recoil/whoamiState";
import { LEVEL3 } from "../recoil/whoamiType";
import GameInfo from "../components/GameInfo";


// const Pong: NextPage = () => {
//   return (
//     <Layout title={"pong - trans_front"}>
//       <PongPage />
//     </Layout>
//   );
// }

const Pong: NextPage = () => {
  const router = useRouter();
  const accessLevel = useRecoilValue(accessLevelAtom);

  useEffect(()=>{
    if (accessLevel.bitwise < LEVEL3) {
      router.push("/");
    }
  }, []);

  return (
    <Layout title={"pong - trans_front"}>
      {accessLevel.bitwise < LEVEL3 ? null : <PongPage />}
    </Layout>
  );
}
export default Pong;



const PongPage: React.FC = () => {

  return (
    <div className="">
      <Section title="Pong (use w,s)" tsize={2}>
      <div>

        <div className="flex">
          <div className="flex flex-col w-80">
            <GameInfo/>
          </div>

          <div className="flex flex-col">
            <div className="flex">
              <SocketButtons />
              <PongButtons/>
            </div>
            <PongGame />
          </div>
        </div>


      </div>
      </Section>
    </div>
  );
}
