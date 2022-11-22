import type { NextPage } from "next";
import React, { useContext, useEffect } from "react";
import { useRouter } from 'next/router'
import { useRecoilValue } from "recoil";
import axios from "axios";
import { whoamiAtom, accessLevelAtom } from "../recoil/whoamiState";
import Layout, { Section } from "../components/Layout";
import { SocketContext } from "../context/SocketContext";
import { LEVEL1 } from "../recoil/whoamiType";
import { useRecoilCacheRefresh } from "../recoil/recoilUtils";

const Logout: NextPage = () => {
  const router = useRouter();
  const whoamiRefresher = useRecoilCacheRefresh(whoamiAtom);

  const accessLevel = useRecoilValue(accessLevelAtom);
  const socket = useContext(SocketContext);

  useEffect(()=>{

    const intervalID = setInterval(()=>{
      // console.log("logout whoami", whoami, accessLevel.levelStr)

      // const out = logout();
      // console.log("logout out", out, accessLevel)

      // if (whoami == null || out == null || accessLevel.bitwise < LEVEL1) {
      //   router.push("/");
      // } else
        whoamiRefresher();
    }, 3000);

    return ()=>clearInterval(intervalID);
  }, [whoamiRefresher]);


  useEffect(()=>{

  }, [accessLevel]);


  //async function logout() {
  const logout = async()=> {
    const logoutApiUrl = "/sapi/auth/logout";
    const config = {withCredentials: true,}

    let result;
    try {

      const {data:response} = await axios.get(logoutApiUrl, config)
      console.log("logout", response.data?.result);
      result = response.data?.result;

      if (socket.connected) {
        socket.close();
        console.log("socket closed when logging out");
      }

    } catch (err) {
      console.log("logout catch", err);
      //throw new Error(  `Error in 'logout()': ${err}` );
    }

    return result;
  }



  if (accessLevel.bitwise < LEVEL1) {
    router.push("/");
    return (<></>);
  }

  if (accessLevel.bitwise >= LEVEL1) {
    logout();
  }


  return (
    <Layout title="logout - trans_front">
      <LogoutPage/>
    </Layout>
  );
}
export default Logout;

{/* <div className="pt-5">
<Button onClick={logoutTest}>logout</Button>
</div> */}

const LogoutPage: React.FC = () => {
  return (
    <div className="">
      <Section title="Logging out..." tsize={2}>
        <LogoutComponent/>
      </Section>
    </div>
  );
}

const LogoutComponent: React.FC = () => {
  return (<></>);
}
