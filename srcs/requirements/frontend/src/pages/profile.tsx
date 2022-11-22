import type { NextPage } from "next";
import React, { useEffect } from "react";
import { useRouter } from 'next/router'
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Button, Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { accessLevelAtom, useDefaultProfileAtom, whoamiAtom} from "../recoil/whoamiState";
import Layout, { Section } from "../components/Layout";
import Nickname from "../components/Nickname";
import TfaEnable from "../components/TfaEnable";
import { LEVEL2, LEVEL3 } from "../recoil/whoamiType";
import AvatarChange from "../components/AvatarChange";
import { IHistory } from "../recoil/socketType";
import { userMapAtom } from "../recoil/userState";
import { GameMatchHistoryTable } from "../components/GameMatchHistoryTable";
import { getLadderGrade } from "../recoil/gameFn";
import { socketConnectedAtom } from "../recoil/socketState";
import SocketButtons from "../components/SocketButtons";

//export default function Profile(): JSX.Element {
const Profile: NextPage = () => {

    const router = useRouter();
    const accessLevel = useRecoilValue(accessLevelAtom);
    const connected = useRecoilValue(socketConnectedAtom);
    //const accessLevelRefresh = useRecoilCacheRefresh(accessLevelAtom);
    useEffect(()=>{
      //accessLevelRefresh();
      //console.log("Profile[] accessLevel=", accessLevel.levelStr)
    },[]);

    useEffect(()=>{
      if (accessLevel.bitwise < LEVEL2) {
        router.push("/");
      }
    }, [accessLevel]);

    return (
      <Layout title="profile - trans_front">
        {connected && accessLevel.bitwise >=  LEVEL2 ? <ProfilePage/> : null}
      </Layout>
    );
  }
export default Profile;

const ProfilePage: React.FC = () => {
  return (
    <Section title="Profile" tsize={2}>
      <ProfileComponent/>
    </Section>
  );
}

const ProfileComponent: React.FC = () => {
  const router = useRouter();
  const accessLevel = useRecoilValue(accessLevelAtom);

  const whoami = useRecoilValue(whoamiAtom);
  const users = useRecoilValue(userMapAtom);
  const user = users.get(whoami?.whoami as string)

  const setUseDefaultProfile = useSetRecoilState(useDefaultProfileAtom);

  let matchData : IHistory[] = [];

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

  //console.log("===user===", user)
  matchData = user?.matchHistory || [] as IHistory[];

  // useEffect(()=>{
  //   if (accessLevel.bitwise === LEVEL2)
  //     router.push('/');
  // }, [accessLevel]);

  return (
    <div>
    <SocketButtons/>

    <Tabs.Group aria-label="Tabs with icons" style="underline">
      <Tabs.Item active title="Basic" icon={HiUserCircle}>
      <div className="flex flex-col gap-2">
        <Nickname/>
        <AvatarChange/>

        {/*user?.nickname === '$' + user?.login || user?.avatar === 'avatar.png' ? */}
        {accessLevel.bitwise < LEVEL3 ?
        <Button color="light"
          onClick={()=>{
            setUseDefaultProfile(true);
            router.push('/chat');
            //accessLevelRefresh();
          }}
        >
          allow to use the default profile setting just for now
        </Button>
        : null }

      </div>
      </Tabs.Item>
      <Tabs.Item title="Game history" icon={HiClipboardList}>
        <div className="flex flex-col w-3/5 gap-4">

          <div className="flex gap-4 items-center">
            <h5 className="text font-bold tracking-tight text-gray-900 dark:text-white">
              LadderGrade
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400 pr-5">
              {getLadderGrade(user?.ladder!)}({user?.ladder!})
            </p>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              (win: {user?.gameRatio?.win}, lose: {user?.gameRatio?.lose})
            </p>
          </div>

          <GameMatchHistoryTable matchHistory={matchData}/>
        </div>
      </Tabs.Item>
      <Tabs.Item title="Settings" icon={HiAdjustments}>
        <div className="flex flex-col">
        <TfaEnable/>
        </div>
      </Tabs.Item>
    </Tabs.Group>
    </div>

  );
}


/*
const AvatarComponent: React.FC = () => {

  const accessLevel = useRecoilValue(accessLevelSelector);
  const [connected, setConnected] = useRecoilState(socketConnectedAtom);

  const [avatar, setAvatar] = useRecoilState(avatarAtom);
  const avatarRefresh = useRecoilCacheRefresh(avatarAtom);

  const [imageSrc, setImageSrc] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(()=>{
    handleGetOriginalAvatar();

  }, [avatar]);

  const handleGetOriginalAvatar = async() => {
    if (avatar?.path) {
      const imgsrc =  await postAvatarDownloadQuery(avatar?.path, false);
      if (!imgsrc) return;
      setImageSrc(imgsrc)
    }
  }

  const handleSubmit = async(event : React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (!selectedFile) return;
      postAvatarUploadQuery(selectedFile, 300)
        .then(data => {
          if (data && data.result.result === true) {
            console.log("savedPath", data.savedPath);
            avatarRefresh();
            setSelectedFile(null);
          }
        });
    } catch (err) {
      console.log("handleSubmit catch", err);
    }
  }

  const handleFileSelect = async(event) => {
    setSelectedFile(event.target.files[0]);
  }

  return (
    <div className={`bg-${connected?"blue":"red"}-100 p-4 max-w-sm`}>
      <Card
        imgAlt={avatar?.path}
        imgSrc={imageSrc}
      >
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Current avatar
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {avatar?.path}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
          <FileInput accept="image/png, image/jpeg"
            onChange={handleFileSelect}/>
          <Button type="submit"
            color="info" //'dark' | 'failure' | 'gray' | 'info' | 'light' | 'purple' | 'success' | 'warning'
            disabled={!selectedFile}
          >Change</Button>
          </div>
        </form>

      </Card>
    </div>
  );
}


const AvatarComponent0: React.FC = () => {

  const [disabled, setDisabled] = useState(true);
  async function handleChangeAvatar() {
    setDisabled(true);
    console.log("do change avatar");
    setDisabled(false);
  }

  return (
    <div className="max-w-sm">
      <Card
        imgAlt="avatar image"
        imgSrc="/avatar.png"
      >
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Current avatar
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Here are some comments.
        </p>
        <Button
          type="button"
          color="info" //'dark' | 'failure' | 'gray' | 'info' | 'light' | 'purple' | 'success' | 'warning'
          disabled={disabled}
          onClick={handleChangeAvatar}
        >
          Change
        </Button>

      </Card>
    </div>
  );
}
*/
