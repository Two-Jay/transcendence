import { Button, Checkbox, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { socketConnectedAtom } from "../recoil/socketState";
import { postTfaEnableQuery, tfaEnableAtom } from "../recoil/tfaEnableState";
import { accessLevelAtom } from "../recoil/whoamiState";
import { LEVEL2 } from "../recoil/whoamiType";


const TfaEnable: React.FC = () => {
  const accessLevel = useRecoilValue(accessLevelAtom);
  const [connected, _0] = useRecoilState(socketConnectedAtom);

  const [newChecked, setNewChecked] = useState(false);
  //const tfaEnable = useRecoilValueLoadable(tfaEnableAtom);
  //const setTfaEnable = useSetRecoilState(tfaEnableAtom);
  const [tfaEnable, setTfaEnable] = useRecoilState(tfaEnableAtom);
  //const tfaEnableRefresh = useRecoilCacheRefresh(tfaEnableAtom);
  //const tfaEnableUpdator = useSetRecoilState(tfaEnableUpdateSelector);


  useEffect(()=>{
    setNewChecked(Boolean(tfaEnable));
  }, [tfaEnable]);


  function handleClick() {
    console.log("handleClick", newChecked);
    //1st - 5th try, ref: Nicknam.tsx

    //6th try
    postTfaEnableQuery(newChecked)
      .then((newVal)=>newVal?setTfaEnable(newVal):null)
      //.then(newVal=>tfaEnableUpdator(newVal as any));
      .then(()=>console.log("===tfa===", tfaEnable, newChecked))

  }

  //<div className={`w-48 bg-${accessLevel.bitwise >= LEVEL2?"blue":"red"}-100 p-4 w-max`}>

  return (
    <div className={`w-48 bg-${connected?"blue":"red"}-100 p-4 w-max`}>
    <form className="flex flex-col gap-4">
      <div className="flex flex-none items-center gap-2">
        <Checkbox id="tfa" disabled={!connected || accessLevel.bitwise < LEVEL2}
          checked={newChecked}
          onChange={e=>{
            //e.preventDefault();
            setNewChecked(e.target.checked);
            }} />
        <Label htmlFor="tfa">use 2FA (e-mail)</Label>
        <Label>{JSON.stringify(tfaEnable)}</Label>
      </div>
      <Button
        type="button"
        disabled={!connected || tfaEnable === newChecked}
        onClick={handleClick}
      >
        Change Tfa Option
      </Button>
    </form>
  </div>
  );
}
export default TfaEnable;


/*



  */
