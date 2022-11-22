import { Button, Card, Tooltip } from "flowbite-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useRecoilState, useRecoilValue } from "recoil";
import { GameMatchHistoryTable } from "../../components/GameMatchHistoryTable";
import Layout, { Section } from "../../components/Layout";
import SocketButtons from "../../components/SocketButtons";
import { postAvatarDownloadQuery } from "../../recoil/avatarState";
import { getLadderGrade } from "../../recoil/gameFn";
import { UserMapUtils } from "../../recoil/mapUtils";
import { IHistory } from "../../recoil/socketType";
import { postBlockQuery, postFriendQuery, userMapAtom } from "../../recoil/userState";
import { accessLevelAtom } from "../../recoil/whoamiState";
import { LEVEL2 } from "../../recoil/whoamiType";


type UserProfileProps = {
  login: string;
}

const UserProfile: NextPage = () => {
  const router = useRouter();
  const accessLevel = useRecoilValue(accessLevelAtom);
  const {pid} = router.query;
  const users = useRecoilValue(userMapAtom);
  const login = pid as string;

  useEffect(()=>{
    if (accessLevel.bitwise < LEVEL2) {
      router.push("/");
    }
  }, [accessLevel]);

  if (!users.has(login as string)) {
    router.push('/404')
    return(<div></div>);
  }

  return (
    <Layout title="profile - trans_front">
      <UserProfilePage login={login}/>
    </Layout>
  );

}
export default UserProfile;

const UserProfilePage: React.FC<UserProfileProps> = ({login}) => {
  return (
    <Section title={login+"'s Profile"} tsize={2}>
      <UserProfileComponent login={login}/>
    </Section>
  );
}

const UserProfileComponent: React.FC<UserProfileProps> = ({login}) => {
  const router = useRouter();
  const [users, setUsers] = useRecoilState(userMapAtom);
  const user = users.get(login);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(()=>{
    handleGetOriginalAvatar();
  }, [users]);

  const handleGetOriginalAvatar = async() => {
    if (user?.avatar) {
      const imgsrc =  await postAvatarDownloadQuery(user.avatar, 300);
      if (!imgsrc) return;
      setImageSrc(imgsrc)
    }
  }

    /*
  matchHistory[0]

  begin: "2022-11-09T16:43:18.603Z"
  end: "2022-11-09T17:33:35.503Z"
  login: "indivisibilibus@gmail.com"
  enemy: "seongcho"
  id: 4
  owner: {id: 2, login: 'indivisibilibus@gmail.com', createAt: '2022-11-09T16:06:35.635Z', nickname: 'bbb', avatar: 'avatar.png', …}
  result: 1
  roomId: 3
    */

  let matchData : IHistory[];

  matchData = user?.matchHistory as IHistory[];


  const handleFriendClick = async (login: string, add: boolean) => {

    console.log("handleFriendClick", login, add);
    //return;
    postFriendQuery(login, add)
      .then(ret => {
        if (!ret) return;
        console.log("friend", login, add, users.get(login))

        UserMapUtils.set2(users, user!)
          .then(newUsers=>{setUsers(newUsers)});
      })
  }

  const handleBlockClick = async (login: string, add: boolean) => {

    postBlockQuery(login, add)
      .then(ret => {
        if (!ret) return;
        UserMapUtils.set2(users, user!)
          .then(newUsers=>setUsers(newUsers));
      })
  }

  return(<div className="">
        <SocketButtons/>

      <div className="flex flex-col gap-4">

        <div className="flex gap-2 items-center">
          <Button color="light" onClick={()=>router.back()} >
          <HiArrowLeft className="mr-2 h-5 w-5" />
            Go back to the previous page
          </Button>

          <div className="flex pl-5">
          <Tooltip content={user?.isFriend? "Friend On" : "Friend Off"} style="auto">
          <label htmlFor={`friend${user?.login}-green-toggle`} className="inline-flex relative items-center mr-5 cursor-pointer">
            <input   key={`friend${user?.login}-green-toggle`}
                    type="checkbox" value="" id={`friend${user?.login}-green-toggle`} className="sr-only peer"
                    checked={user?.isFriend} onChange={e => {
                      console.log("friend", e.target, e.currentTarget)
                      handleFriendClick(user?.login as string, e.target.checked)}}/>
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
          </label>
          </Tooltip>

          <Tooltip content={user?.isBlock? "Block On" : "Block Off"} style="auto">
          <label htmlFor={`block${user?.login}-red-toggle`} className="inline-flex relative items-center mr-5 cursor-pointer">
            <input   key={`block${user?.login}-red-toggle`}
                    type="checkbox" value="" id={`block${user?.login}-red-toggle`} className="sr-only peer"
                    checked={user?.isBlock} onChange={e => handleBlockClick(user?.login as  string, e.target.checked)}/>
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
          </label>
          </Tooltip>
          </div>

        </div>

        <div className="flex flex-col gap-4 w-2/5">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Basic Info
          </h5>
          <Card imgAlt={user?.avatar} imgSrc={imageSrc}>
            <div className="flex gap-4 items-center">
              <h5 className="text font-bold tracking-tight text-gray-900 dark:text-white">
                Login
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {user?.login}
              </p>
            </div>

            <div className="flex gap-4 items-center">
              <h5 className="text font-bold tracking-tight text-gray-900 dark:text-white">
                Nickname
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {user?.nickname}
              </p>
            </div>

            <div className="flex gap-4 items-center">
              <h5 className="text font-bold tracking-tight text-gray-900 dark:text-white">
                Avatar
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {user?.avatar}
              </p>
            </div>


            <div className="flex gap-4 items-center">
              <h5 className="text font-bold tracking-tight text-gray-900 dark:text-white">
                LadderGrade
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400 pr-5">
                {getLadderGrade(user?.ladder!)} ({user?.ladder!})
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                (win: {user?.gameRatio?.win}, lose: {user?.gameRatio?.lose})
              </p>
            </div>


          </Card>
        </div>

        <div className="flex flex-col gap-4 w-3/5">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Game match history
          </h5>
          <GameMatchHistoryTable matchHistory={matchData}/>
        </div>
      </div>

  </div>);
}
