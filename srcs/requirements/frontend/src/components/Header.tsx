import NavLink from "./NavLink";
import { Avatar, DarkThemeToggle, Dropdown, Navbar } from "flowbite-react";
import Image from "next/image";
import { FC, useContext, useEffect, useState } from "react";
import { useSidebarContext } from "../context/SidebarContext";
import {  useRecoilState, useRecoilValue } from "recoil";
import {  collapsedSidebarState, pushingState } from "../recoil/menuState";
import { useRouter } from "next/router";
import { accessLevelAtom, whoamiAtom } from "../recoil/whoamiState";
import { nicknameAtom } from "../recoil/nicknameState";
import { AVATAR_CHECK, LEVEL0, LEVEL2, LEVEL4 } from "../recoil/whoamiType";
import { userMapAtom } from "../recoil/userState";
import { SocketContext } from "../context/SocketContext";
import { postAvatarDownloadQuery } from "../recoil/avatarState";

const Header: FC<Record<string, never>> = function () {
  const router = useRouter();
  const [pushing, setPushing] = useRecoilState(pushingState);
  const socket = useContext(SocketContext);
  const [socketState, setSocketState] = useState(false);

  useEffect(()=>{
    setSocketState(socket.connected);
  }, [socket.connected, socket.disconnected]);

  router.events.on('routeChangeStart', () => {
    setPushing(true);
    //console.log('pushing on');
  })
  router.events.on('routeChangeComplete', () => {
    setPushing(false);
    //console.log('pushing off');
  })

  const [collapsedSidebar, setCollapsedSidebar] = useRecoilState(collapsedSidebarState);
  const whoami = useRecoilValue(whoamiAtom);
  const nickname = useRecoilValue(nicknameAtom);
  //const avatar = useRecoilValue(avatarAtom);
  const accessLevel = useRecoilValue(accessLevelAtom);
  const users = useRecoilValue(userMapAtom);
  const myself = users.get(whoami?.whoami as string)
  const [avatarImgSrc, setAvatarImgSrc] = useState(accessLevel.bitwise & AVATAR_CHECK ? myself?.avatarImgSrc: '');
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } = useSidebarContext();

  useEffect(()=>{
    handleGetAvatar();
  }, [myself, users]);

  const handleGetAvatar = async() => {
    if (myself?.avatar) {
      if (myself?.avatarImgSrc) {
        //console.log("myself?.avatarImgSrc", myself?.avatarImgSrc)
        setAvatarImgSrc(accessLevel.bitwise >= LEVEL2 ? myself?.avatarImgSrc: '')
        return;
      }
      const imgsrc =  await postAvatarDownloadQuery(myself.avatar, 64);
      if (!imgsrc) return;
      //console.log("handleGetAvatar-imgsrc", imgsrc)
      setAvatarImgSrc(accessLevel.bitwise >= LEVEL2 ? imgsrc: '')
    }
  }

  const handleDropdownItemClick = (to:string) => {
    if (!pushing)
      router.push(to);
    else
      console.log('already pushing to', to)
  }

  return (
    <header className="sticky top-0 z-20">
      <Navbar fluid rounded>
        {isPageWithSidebar && (
          <button
            aria-controls="sidebar"
            aria-expanded="true"
            className="mr-2 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden"
            onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
          >
            {isOpenOnSmallScreens ? (
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            )}
          </button>
        )}
        <Navbar.Brand>
          <Image
            onClick = {()=>setCollapsedSidebar(!collapsedSidebar)}
            alt="FT logo"
            height="24"
            src="/42.png"
            width="24"
          />
          <span
            className="self-center whitespace-nowrap px-3 text-xl font-semibold dark:text-white">
            FT
          </span>
        </Navbar.Brand>

        <div className="flex md:order-2">
          <div className="pr-4">
          <Dropdown
            inline
            label={
              <Avatar
                alt="User menu"
                img = {avatarImgSrc}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">bitwise: {(accessLevel.bitwise).toString(2)}</span>
              <span className="block text-sm">{accessLevel.levelStr}: {accessLevel.msg}</span>
              <Dropdown.Divider />

              <span className="block text-sm">{whoami? whoami?.whoami : "noname"}</span>
              <span className="block truncate text-blue-500 text-sm font-medium">
                {nickname? nickname: "$noname"}
              </span>
            </Dropdown.Header>
            {accessLevel.bitwise === LEVEL0 ? <Dropdown.Item onClick={()=>handleDropdownItemClick('/login')}>Login </Dropdown.Item>:null}
            {accessLevel.bitwise > LEVEL0   ? <Dropdown.Item onClick={()=>handleDropdownItemClick('/logout')}>Logout</Dropdown.Item>:null}
            {accessLevel.bitwise > LEVEL4   ? <Dropdown.Divider />:null}
            {accessLevel.bitwise > LEVEL4   ? <Dropdown.Item onClick={()=>handleDropdownItemClick('/withdraw')}>Withdraw</Dropdown.Item>:null}

          </Dropdown>
          </div>

          <Navbar.Toggle />
          <DarkThemeToggle />
        </div>


        <Navbar.Collapse>
          <NavLink to="/" text="Home" able={true}/>
          {accessLevel.bitwise === LEVEL0 ? <NavLink to="/login" text="Login" able={true}/> : null}
          {accessLevel.bitwise > LEVEL0   ? <NavLink to="/logout" text="Logout" able={true}/> : null}
          {accessLevel.bitwise > LEVEL4   ? <NavLink to="/withdraw" text="Withdraw" able={true} /> :null}

          <NavLink to="/help" text={`Help${socketState?'+':''}`} able={true}/>
        </Navbar.Collapse>
      </Navbar>

    </header>
  );
};

export default Header;

//if (currentSession.data?.tfa === '1')
