import type { NextPage } from "next";
import { useRouter } from 'next/router'
//import { ReactNode } from "react";
//import type { NextPage } from 'next'
import { useRecoilState, useRecoilValue } from "recoil";
//import { indexQueryState } from "../recoil/indexState";
//import { useEffect } from "react";
//import { getCookie } from 'cookies-next';
import { useEffect } from "react";
import { accessLevelAtom} from "../recoil/whoamiState";
import { chatUserListVisitCountAtom } from "../recoil/socketState";
import { LEVEL2 } from "../recoil/whoamiType";

//export default function Index(): JSX.Element {
const Update: NextPage = () => {
  const router = useRouter();

  // const bWhoami = useRecoilValue(bWhoamiAtom);
  // const tfaEnable = useRecoilValue(tfaEnableSelector);
  // const online = useRecoilValue(onlineSelector);
  const accessLevel = useRecoilValue(accessLevelAtom);
  //const accessLevelRefresh = useRecoilCacheRefresh(accessLevelAtom);
  //const [avatarChangeVisitCount, setAvatarChangeVisitCount] = useRecoilState(avatarChangeVisitCountAtom);
  const [chatUserListVisitCount, setChatUserListVisitCount] = useRecoilState(chatUserListVisitCountAtom);

  useEffect(()=>{
    //whoamiRefresher();
    //socketInitLocal();
    //accessLevelRefresh();

    return () => {
      //whoamiRefresher();
      //socketFinalLocal();
    }
  }, []);

  useEffect(()=>{

    if(accessLevel.bitwise === LEVEL2){
      console.log("go to /profile after login -------- in")
      //setAvatarChangeVisitCount(curVal=>curVal+1);
      router.push("/profile");
    }

  }, []);

  useEffect(()=>{
    if (chatUserListVisitCount === 1) {
      console.log("go to /chat -------- ", chatUserListVisitCount);
      setChatUserListVisitCount(curVal=>curVal+1);
      router.push('/chat');
    }
  }, [chatUserListVisitCount]);


  return (<div></div>);
}
export default Update;

