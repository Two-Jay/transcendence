import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Button, Label, TextInput } from "flowbite-react";
//import { deleteCookie } from 'cookies-next';
import axios from "axios";
import { whoamiAtom, accessLevelAtom } from "../recoil/whoamiState";
import Layout, { Section } from "../components/Layout";
import { SocketContext } from "../context/SocketContext";
import { LEVEL1 } from "../recoil/whoamiType";
import { useRecoilCacheRefresh } from "../recoil/recoilUtils";

const tfaStringState = atom<string>({
  key: 'tfaStringState',
default: "TFA"
});

const Tfa: NextPage = () => {

  const router = useRouter();
  //const bWhoami = useRecoilValue(bWhoamiAtom);
  //const tfaEnable = useRecoilValue(tfaEnableSelector);
  //const online = useRecoilValue(onlineSelector);

  const accessLevel = useRecoilValue(accessLevelAtom);
  const accessLevelRefresh = useRecoilCacheRefresh(accessLevelAtom);

  useEffect(()=>{
    //whoamiRefresher();
    accessLevelRefresh();

    return () => {
      //whoamiRefresher();
    }
  }, []);


  useEffect(()=>{
    console.log("tfa==in===", accessLevel.bitwise.toString(2));
    if (accessLevel.bitwise !== LEVEL1) {
     router.push("/");
    }
  }, [accessLevel]);


  console.log("tfa==out===", accessLevel.bitwise.toString(2));
    //if (accessLevel.bitwise !== LEVEL1) {
    //  router.push("/");
    //}



  /*
  //if !bWhoami, go to index
  //if !tfaEnabled, go to index
  //if tfaEnabled && codeChecked, go to index

  if (bWhoami) {
    router.push("/");
    return(<></>);
  }
*/

  return (
    <Layout title="Tfa - trans_front">
      <TfaPage />
    </Layout>
  );
}
export default Tfa;

const TfaPage: React.FC = () => {
  const [tfaString, _] = useRecoilState(tfaStringState);

  return (
    <div className="">
      <Section title={tfaString} tsize={2}>
        <TfaForm/>
      </Section>
    </div>
  );
}

const TfaForm: React.FC = () => {

  const setTfaString = useSetRecoilState(tfaStringState);
  const router = useRouter();

  //const bWhoami = useRecoilValue(bWhoamiAtom);
  const whoamiRefresher = useRecoilCacheRefresh(whoamiAtom);
  const accessLevel = useRecoilValue(accessLevelAtom);
  const socket = useContext(SocketContext);
  const [disabled, setDisabled] = useState(accessLevel.bitwise !== LEVEL1);
  const [inputValue, setInputValue] = useState(0);
  const [_, setCalledPush] = useState(false);


  useEffect(()=>{

  }, []);


  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setDisabled(true);
    setTfaString("Logging in...")
    //setCookie('code', inputValue);

    try {
      const tfaApiUrl = "/sapi/auth/tfa";
      let config = { withCredentials: true };
      const postdata = { code: inputValue}

      console.log("tfa config, postdata", config, postdata);
      const response = await axios.post(tfaApiUrl, postdata, config);
      console.log("tfa response", response);
      console.log("tfa response.data.result", response.data.result);
      if (response.data.result) {
        console.log("tfa result true", response.data, "go to index");
        //deleteCookie('tfaEnable');
        //deleteCookie('code');
        if (accessLevel.bitwise === LEVEL1) {
          //if (socket.connected) {
            socket.close().open();
            console.log("socket re-opended after tfa passed")
         // }

          let calledPushLatest;
          setCalledPush(latest => {
              calledPushLatest = latest;
              return latest;
          })

          if(calledPushLatest) return;
          setCalledPush(true);
          router.push("/");

        }
      } else {
        setDisabled(false);
        setTfaString("TFA code is not working, but you can try again");
        whoamiRefresher();

      }
    } catch (error) {
      console.log(error);
      setDisabled(false);
      setTfaString("TFA code is not working, but you can try again");
      whoamiRefresher();
    }

  }

  return (
    <div className="flex flex-row gap-14">

    <form className="flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <div className="">
        <div className="mb-2 block">
          <Label htmlFor="code">tfa code</Label>
        </div>
        <TextInput id="code" type="password" name="password" autoComplete="on"
          minLength={6}
          maxLength={6}
          pattern="[0-9]{6}"
          disabled={disabled}
          required
          onChange={e=>{setInputValue(Number(e.target.value))}}
          />
      </div>
      <Button
        type="submit"
        disabled={disabled}
      >
        Submit
      </Button>
{/*
      <Label>{JSON.stringify(tfa)}</Label>
      <Label>{JSON.stringify(refreshTfa)}</Label>
*/}
    </form>
  </div>
  );
}


/*

const TfaForm0: React.FC = () => {

  const [_, setTfaString] = useRecoilState(tfaStringState);
  const router = useRouter();
  const accessLevel = useRecoilValue(accessLevelAtom);

  const [disabled, setDisabled] = useState(accessLevel.bitwise !== LEVEL1);
  const [inputValue, setInputValue] = useState(0);

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setDisabled(true);
    setTfaString("Logging in...")
    //setCookie('code', inputValue);

    try {
      const logoutApiUrl = "/sapi/auth/tfa";
      let config = { withCredentials: true,}
      const response = await axios.get(logoutApiUrl, config);
      console.log("tfa response.data.result", response.data.result);
      if (response.data.result) {
        console.log("tfa result true", response.data, "go to index");
        //deleteCookie('tfaEnable');
        //deleteCookie('code');
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setDisabled(false);
      setTfaString("TFA code is not working")
    }

    //setDisabled(false);
    //setTfaString("Tfa")
  }

  return (
    <div className="flex flex-row gap-14">
    <form className="flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <div className="">
        <div className="mb-2 block">
          <Label htmlFor="code">tfa code</Label>
        </div>
        <TextInput id="code" type="password"
          minLength={6}
          maxLength={6}
          pattern="[0-9]{6}"
          disabled={false}
          required
          onChange={e=>{setInputValue(Number(e.target.value))}}
          />
      </div>
      <Button
        type="submit"
        disabled={disabled}
      >
        Submit
      </Button>
    </form>
  </div>
  );
}
*/
