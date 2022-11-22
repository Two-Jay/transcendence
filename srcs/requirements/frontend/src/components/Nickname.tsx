import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { MapUtils } from "../recoil/mapUtils";
import { nicknameAtom, postNicknameQuery } from "../recoil/nicknameState";
import { socketConnectedAtom } from "../recoil/socketState";
import { toastMapAtom } from "../recoil/toastState";
import { FToast, ToastType } from "../recoil/toastType";


const Nickname: React.FC = () => {

  const [connected, _0] = useRecoilState(socketConnectedAtom);
  const [inputValue, setInputValue] = useState<string>("nickname");

  //const nickname = useRecoilValueLoadable(nicknameAtom);
  const [nickname, setNickname] = useRecoilState(nicknameAtom);

  const setToasts = useSetRecoilState(toastMapAtom);

  useEffect(()=>{
    setInputValue(String(nickname));
  }, [nickname]);


  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("handleSubmit", inputValue);

    //1st try working
    //updateNicknameAtom();

    //2nd try working
    // setNicknameAtom(inputValue)
    //   .then(()=>{nicknameRefresh();});

    //3rd try working
    // updateNickname(inputValue)
    //   .then((newVal)=>newVal ? setNickname(()=>newVal) : null);

    //4th try not working again? why
    //setNickname(inputValue)

    //5th try working -> 3rd + null check in the selector
    // updateNickname(inputValue)
    //   .then(newVal=>nickNameUpdator(newVal as any));

    //6th try
    postNicknameQuery(inputValue)
      //.then(()=>nicknameRefresh);
      .then(newVal=>{
        if (newVal == null) {
          setToasts((curVal)=>{
            const message = "Nickname is unique-protected. Use another nickname!";
            const toast = new FToast("Nickname is unique-protected", ToastType.HiExclamation,  message, 30);
            return MapUtils.set(curVal, toast.id, toast);
          });
          return;
        }
        setNickname(newVal);
        //const messageDataDto = new MessageDataDto(undefined, "nickname", newVal);
        //console.log("emit iDetail --->", messageDataDto);
        //socket.emit("iDetail", messageDataDto);
      });
      //.then(newVal=>nickNameUpdator(newVal as any));
  }

  //    <div className={`bg-${accessLevel.bitwise >= LEVEL2?"blue":"red"}-100 p-4 w-max`}>

  return (
    <div className={`bg-${connected?"blue":"red"}-100 p-4 w-max`}>
    <form className="flex flex-col gap-2"
      onSubmit={handleSubmit}
    >
        <div className="flex gap-2 mb-2 w-max">
          <Label htmlFor="nickname">
            <span className="dark:text-blue-900">Current nickname:</span>
            </Label>
          <Label>
            <span className="text-yellow-400">
            {nickname}
            </span>
            </Label>
        </div>
        <div className="flex gap-2">
          <TextInput id="nickname" type="name"
            minLength={3}
            maxLength={20}
            //https://cheatography.com/davechild/cheat-sheets/regular-expressions/
            pattern="[^\$]*" //"^(?!\$).*"
            disabled={!connected}
            required
            placeholder={nickname}
            onChange={e=>{setInputValue(e.target.value)}}
            />
        <Button
          type="submit"
          disabled={!connected || nickname === inputValue}
        >
          Change
        </Button>
        </div>
    </form>
  </div>
  );
}

export default Nickname;
