import type { NextPage } from "next";
import React, { useContext, useEffect } from "react";
import { useRouter } from 'next/router'
import { useRecoilValue } from "recoil";
import axios from "axios";
import { whoamiAtom, accessLevelAtom } from "../recoil/whoamiState";
import { SocketContext } from "../context/SocketContext";
import { LEVEL1 } from "../recoil/whoamiType";
import Layout, { Section } from "../components/Layout";
import { useRecoilCacheRefresh } from "../recoil/recoilUtils";

const Withdraw: NextPage = () => {
  const router = useRouter();
  const whoamiRefresher = useRecoilCacheRefresh(whoamiAtom);

  const accessLevel = useRecoilValue(accessLevelAtom);
  const socket = useContext(SocketContext);

  useEffect(()=>{
    const intervalID = setInterval(whoamiRefresher, 1000);

    if (accessLevel.bitwise < LEVEL1) {
      router.push("/");
    }

    return ()=>clearInterval(intervalID);
  }, [whoamiRefresher]);


  useEffect(()=>{

  }, [accessLevel]);


  //async function withdraw() {
  const withdraw = async() => {
    const withdrawApiUrl = "/sapi/auth/withdraw";
    const config = {withCredentials: true,}

    let result;
    try {

      const {data:response} = await axios.get(withdrawApiUrl, config)
      console.log("withdraw", response.data?.result);
      result = response.data?.result;

      if (socket.connected) {
        socket.close();
        console.log("socket closed when withdrawing");
      }

    } catch (err) {
      console.log("withdraw catch", err);
      //throw new Error(  `Error in 'withdraw()': ${err}` );
    }

    return result;
  }



  if (accessLevel.bitwise < LEVEL1) {
    router.push("/");
    return(<></>);
  }

  if (accessLevel.bitwise >= LEVEL1) {
    withdraw();
  }


  return (
    <Layout title="withdraw - trans_front">
      <WithdrawPage />
    </Layout>
  );
}
export default  Withdraw;

const WithdrawPage: React.FC = () => {
  return (
    <div className="">
      <Section title="Withdrawing..." tsize={2}>
        <WithdrawComponent />
      </Section>
    </div>
  );
}

const WithdrawComponent: React.FC = () => {

  return (<></>);
}
