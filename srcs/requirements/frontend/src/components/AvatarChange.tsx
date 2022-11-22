
import React, {useEffect, useState } from "react";
import { useRecoilState, useRecoilValue} from "recoil";
import { Button, Card, FileInput } from "flowbite-react";
import { postAvatarDownloadQuery, postAvatarUploadQuery } from "../recoil/avatarState";
import { avatarChangeVisitCountAtom, socketConnectedAtom } from "../recoil/socketState";
import { accessLevelAtom, whoamiAtom } from "../recoil/whoamiState";
import { userMapAtom } from "../recoil/userState";
import { useRouter } from "next/router";
import { LEVEL2 } from "../recoil/whoamiType";
import { useRecoilCacheRefresh } from "../recoil/recoilUtils";
//import { LEVEL2 } from "../recoil/whoamiType";
//import { useRouter } from "next/router";
//import { SocketContext } from "../context/SocketContext";

const AvatarChange: React.FC = () => {
  const router = useRouter();
  //const socket = useContext(SocketContext);
  const [connected, _] = useRecoilState(socketConnectedAtom);

  //const [avatar, _2] = useRecoilState(avatarAtom);
  //const avatarRefresh = useRecoilCacheRefresh(avatarAtom);
  const whoami = useRecoilValue(whoamiAtom);
  const users = useRecoilValue(userMapAtom);
  //const usersRefresh = useRecoilCacheRefresh(userMapAtom);
  const myself = users.get(whoami?.whoami as string);
  const accessLevel = useRecoilValue(accessLevelAtom);
  const accessLevelRefresh = useRecoilCacheRefresh(accessLevelAtom);

  const [imageSrc, setImageSrc] = useState('');
  const [selectedFile, setSelectedFile] = useState<File>();
  const [avatarChangeVisitCount, setAvatarChangeVisitCount] = useRecoilState(avatarChangeVisitCountAtom);

  useEffect(()=>{
    //accessLevelRefresh();
    //console.log("AvatarChange[] accessLevel=", accessLevel.levelStr)
    //for the first time to visit AvatarChange, visit index to make it flow naturally
    if (accessLevel.bitwise === LEVEL2 && avatarChangeVisitCount === 0) {
      setAvatarChangeVisitCount(curVal=>curVal+1);
      router.push('/update');
      //router.reload();
      //router.replace(router.asPath);
    }

    handleGetOriginalAvatar();
  }, []);

  useEffect(()=>{
    handleGetOriginalAvatar();
  }, [myself]);

  const handleGetOriginalAvatar = async() => {
    if (myself?.avatar) {
      const imgsrc =  await postAvatarDownloadQuery(myself?.avatar, 300);
      if (!imgsrc) return;
      setImageSrc(imgsrc)
    }
  }

  const handleSubmit = async(event : React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (!selectedFile) return;
      postAvatarUploadQuery(selectedFile, 300)  //resize image, set maxSize to 300
        .then(data => {
          if (data && data.result.result === true) {
            //const messageDataDto = new MessageDataDto(undefined, "avatar", data.savedPath);
            //console.log("emit iDetail --->", messageDataDto);
            //socket.emit("iDetail", messageDataDto);
            //console.log("===avatar refresh===")
            //avatarRefresh();
            setSelectedFile(undefined);
            //console.log("---accessLevel---", accessLevel.levelStr)
            // if (accessLevel.bitwise === LEVEL2) {
            //   router.push('/');
            // }
            accessLevelRefresh();
          }
        });
    } catch (err) {
      console.log("handleSubmit catch", err);
    }
  }

  const handleFileSelect = async(event: React.ChangeEvent<HTMLInputElement>) => {
    //setSelectedFile(event.target.files[0]); return;
    const fList = event.currentTarget.files as FileList;
    if (!fList || fList.length === 0) return;
    const file = fList[0] as File;
    if (!file) return;
    setSelectedFile(file);
  }

  return (
    <div className={`bg-${connected?"blue":"red"}-100 p-4 max-w-sm`}>
      <Card
        imgAlt={myself?.avatar}
        imgSrc={imageSrc}
      >
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Current avatar
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {myself?.avatar}
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

export default AvatarChange;

