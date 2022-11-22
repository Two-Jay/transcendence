
import { BiBuoy } from "react-icons/bi";
import {
  HiHome,
  HiUser,
  HiUsers,
  HiChat,
} from "react-icons/hi";
import {
  RiPingPongFill
} from "react-icons/ri";

import Sidebar from "./Sidebar";

import React from "react";

import { useRecoilValue } from "recoil";
import SidebarLink from "./SidebarLink";
import { accessLevelAtom } from "../recoil/whoamiState";
import { LEVEL2, LEVEL3 } from "../recoil/whoamiType";

export default function ActualSidebar(): JSX.Element {

  //const [isActive, setIsActive]=useState(false);
  //const [currentUser, setCurrentUser] =  useRecoilState(currentUserState);

  //const socket = useContext(SocketContext);
  const accessLevel = useRecoilValue(accessLevelAtom);

  // if (bWhoami2 && socket.disconnected) {
  //   socket.open();
  // }

  return (
    <Sidebar>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <SidebarLink to="/" text="Home" icon={HiHome} able={true}/>
          {accessLevel.bitwise >= LEVEL2 ? <SidebarLink to="/profile" text="Profile" icon={HiUser} able={true}/> : null }
          {accessLevel.bitwise >= LEVEL3 ? <SidebarLink to="/users" text="Users" icon={HiUsers} able={true}/> : null }
          {accessLevel.bitwise >= LEVEL3 ? <SidebarLink to="/chat" text="Chat" icon={HiChat} able={true}/> : null }
          {accessLevel.bitwise >= LEVEL3 ? <SidebarLink to="/pong" text="Pong" icon={RiPingPongFill} able={true}/> : null }

        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <SidebarLink to="/help" text={"Help"} icon={BiBuoy} able={true}/>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );

}


/*

  return (
    <Sidebar>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <SidebarLink to="/" text="Home" icon={HiHome} able={true}/>
          {bWhoami2? <SidebarLink to="/profile" text="Profile" icon={HiUser} able={bWhoami}/> : null }
          {bWhoami2?<SidebarLink to="/users0" text="Users0" icon={HiUsers} able={true}/> : null}
          {bWhoami2? <SidebarLink to="/users" text="Users" icon={HiUsers} able={bWhoami}/> : null }
          {bWhoami2? <SidebarLink to="/chat" text="Chat" icon={HiChat} able={bWhoami}/> : null }
          {bWhoami2? <SidebarLink to="/pong" text="Pong" icon={RiPingPongFill} able={bWhoami}/> : null }

        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <SidebarLink to="/help" text="Help" icon={BiBuoy} able={true}/>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );


*/
