import type { NextPage } from "next";
import {  Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useRecoilValue, useRecoilState, atom } from "recoil";
//import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { accessLevelAtom } from "../recoil/whoamiState";
import Layout, { Section } from "../components/Layout";
import { LEVEL0, LEVEL1, LEVEL2 } from "../recoil/whoamiType";

const loginStringState = atom<string>({
  key: 'loginStringState',
  default: "Login"
});

const Login: NextPage = () => {
  const router = useRouter();
  //const whoamiRefresher = useRecoilCacheRefresh(whoamiAtom);

  const accessLevel = useRecoilValue(accessLevelAtom);

  // useEffect(()=>{
  //   whoamiRefresher();
  //   return () => {
  //     whoamiRefresher();
  //   }
  // }, []);

  useEffect(()=>{

    if (accessLevel.bitwise > LEVEL2) {
      router.push("/");
    }
    else if (accessLevel.bitwise > LEVEL1) {
      router.push("/");
    }

  }, [accessLevel]);



/*

  console.log(getCookie('tfaEnable'));

  if (!session && getCookie('tfaEnable')) {
    console.log(session);
    router.push("/tfa");
    return(<></>);
  }

  if (session) {
    console.log(session);
    router.push("/");
    return(<></>);
  }
*/

  return (
    <Layout title={"login - trans_front"}>
       <LoginPage />
    </Layout>
  );
}
export default Login;


const LoginPage: React.FC = () => {

  const [loginString, _] = useRecoilState(loginStringState);

  return (
    <div className="">
      <Section title={loginString} tsize={2}>
        <LoginForm />
      </Section>
    </div>
  );
}

const LoginForm: React.FC = () => {
  const [_, setLoginString] = useRecoilState(loginStringState);
  const router = useRouter();
  const accessLevel = useRecoilValue(accessLevelAtom);

  const [disabled, setDisabled] = useState(accessLevel.bitwise > LEVEL0);

  useEffect(() => {
    return () => {
      //deleteCookie(tfaEnable);
    };

  }, []);

  async function handleLogin(option:string) {
    setDisabled(true);
    setLoginString("Logging in...")
    var url;
    if (option === "ft") {
      url = `${process.env.NEXT_PUBLIC_API_SERVER}/auth/login/ft`;
    } else if (option === "gg") {
      url = `${process.env.NEXT_PUBLIC_API_SERVER}/auth/login/google`;
      //deleteCookie('tfaEnable');
    } else {
      url = `http://daum.net`;
    }
    console.log(url);
    router.push(url);
    //setDisabled(false);
  }

  return (
    <div className="flex flex-row gap-14">
    <form className="flex flex-col gap-4">
      <Button
        type="button"
        disabled={disabled}
        onClick={()=>handleLogin("ft")}
      >
        42 Login
      </Button>
      {/*
      <div className="flex items-center gap-2">
        <Checkbox id="tfa" disabled={disabled}
          checked={checked}
          onChange={e=>{
            setChecked(e.target.checked);
            setCookie('tfaEnable', e.target.checked);
            }} />
        <Label htmlFor="tfa">use 2FA (e-mail)</Label>
      </div>
      */}
    </form>

    <form className="flex flex-col gap-4">
    <Button
      type="button"
      disabled={disabled}
      onClick={()=>handleLogin("gg")}
    >
      Google Login
    </Button>

  </form>
  </div>
  );
}
