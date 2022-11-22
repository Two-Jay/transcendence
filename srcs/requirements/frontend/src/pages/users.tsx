
import type { NextPage } from "next";
import React, { useEffect } from "react";
import { useRouter } from 'next/router'
import { useRecoilValue } from "recoil";
import Layout, { Section } from "../components/Layout";
import { accessLevelAtom } from "../recoil/whoamiState";
import { LEVEL3 } from "../recoil/whoamiType";
import UsersView from "../components/UsersView";
import SocketButtons from "../components/SocketButtons";

const Users: NextPage = () => {

  const router = useRouter();
  const accessLevel = useRecoilValue(accessLevelAtom);

  useEffect(()=>{
    if (accessLevel.bitwise < LEVEL3) {
      router.push("/");
    }
  }, [accessLevel]);

  return (
    <Layout title="users - trans_front">
      <UsersPage/>
    </Layout>
  );
}
export default Users;

const UsersPage: React.FC = () => {
  return (
    <div className="">
      <Section title="Users" tsize={2}>
        <div className="w-4/5 overscroll-x-auto">
          <SocketButtons/>
          <UsersView/>
        </div>

      </Section>
    </div>
  );
}

