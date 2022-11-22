import { nanoid } from 'nanoid';
import { atom, selector } from "recoil";
import axios from "axios";
import { AccessLevel, AVATAR_CHECK, getWhoamiApiUrl, getWhoamiDetailApiUrl,
        LEVEL1, LEVEL2, LEVEL3,
        NICKNAME_CHECK, SESSION_CHECK, TFA_CHECK, Whoami, WhoamiDetail } from "./whoamiType";
import { nicknameAtom } from './nicknameState';
//import { avatarAtom } from './avatarState';

// import { recoilPersist } from 'recoil-persist'
// const { persistAtom } = recoilPersist({
//   key: 'persistDefaultProfileAtom',
//   //storage: localStorage,
// })

////////////////////////////
/////  whoami          /////
////////////////////////////

//type WhoamiResponse = AxiosResponse<Whoami>;
const config = {withCredentials: true,}
//const getWhoami = (): Promise<WhoamiResponse> =>  axios.get("/sapi/auth/whoami", config)

export const whoamiSelector = selector<Whoami>({
  key: `whoamiSelector/${nanoid()}`,
  get: async ()=> {
    let result : Whoami;
    try {
      //https://stackoverflow.com/questions/48980380/returning-data-from-axios-api
      //use data destructuring to get data from the promise object
      const {data:whoami} = await axios.get<Whoami>(getWhoamiApiUrl, config);//getWhoami();
      result = whoami;
    } catch (err) {
      result = undefined;
      //console.log("whoamiSelector error", err);
    };
    return result;
  }
});

export const whoamiAtom = atom<Whoami>({
  key: `whoamiAtom/${nanoid()}`,
  default: whoamiSelector
});




////////////////////////////
/////  bWhoami         /////
////////////////////////////
/*

export const bWhoamiSelector = selector<boolean>({
  key: 'bWhoamiSelector',
  get: ({get}) => {
    const whoami = get(whoamiAtom);
    return (whoami != null) //test both null and undefined
  },
});

export const bWhoamiAtom = atom<boolean>({
  key: 'bWhoamiAtom',
  default: bWhoamiSelector
});
*/
////////////////////////////
/////  whoamiDetail    /////
////////////////////////////


//type WhoamiDetailResponse = AxiosResponse<WhoamiDetail>;
//const config = {withCredentials: true,}
//const getWhoamiDetail = (): Promise<WhoamiDetailResponse> =>  axios.get("/sapi/auth/whoamiDetail", config)

export const whoamiDetailSelector = selector<WhoamiDetail>({
  key: "whoamiDetailSelector",
  get: async ({get})=> {
    var result : WhoamiDetail;
    try {

      const whoami = get(whoamiAtom);
      if (!whoami) return undefined;

      const {data:whoamiDetail} = await axios.get<WhoamiDetail>(getWhoamiDetailApiUrl, config);
      result = whoamiDetail;
    } catch (err) {
      result = undefined;
      //console.log("whoamiSelector error", err);
    };
    return result;
  },

  cachePolicy_UNSTABLE: {
    eviction: "most-recent",
  },

});

export const whoamiDetailAtom = atom<WhoamiDetail>({
  key: 'whoamiDetailAtom',
  default: whoamiDetailSelector
});


////////////////////////////
/////  bWhoami2         /////
////////////////////////////

/*
export const bWhoami2Selector = selector<boolean>({
  key: 'bWhoami2Selector',
  get: ({get}) => {
    const bWhoami = get(whoamiAtom);
    if (!bWhoami) return false;

    const whoamiDetail = get(whoamiDetailAtom);
    const tfaEnable = whoamiDetail?.whoamiDetail.contents.tfaEnable;
    const online = whoamiDetail?.whoamiDetail.contents.online;
    if (tfaEnable && !online)
      return false;
    else
      return true;
  },
});

export const bWhoami2Atom = atom<boolean>({
  key: 'bWhoami2Atom',
  default: bWhoami2Selector
});
*/

/*
export const nicknameSelector = selector<string | undefined>({
  key: 'nicknameSelector@whoamiDetail',
  get: ({get}) => {
    const whoamiDetail = get(whoamiDetailAtom);
    return whoamiDetail?.whoamiDetail.nickname;
  },
  cachePolicy_UNSTABLE: {
    eviction: "most-recent",
  },
});
*/

export const tfaEnableSelector = selector<boolean>({
  key: 'tfaEnableSelector@whoamiDetail',
  get: ({get}) => {
    const whoamiDetail = get(whoamiDetailAtom);
    const result = !!whoamiDetail?.whoamiDetail.contents.tfaEnable;
    return result;
  },
  /*
  cachePolicy_UNSTABLE: {
    eviction: "most-recent",
  },
  */
});

export const onlineSelector = selector<boolean>({
  key: 'onlineSelector@whoamiDetail',
  get: ({get}) => {
    const whoamiDetail = get(whoamiDetailAtom);
    const result = !!whoamiDetail?.whoamiDetail.contents.online;
    return result;
  },
  /*
  cachePolicy_UNSTABLE: {
    eviction: "most-recent",
  },
  */
});



////////////////////////////
/////  myAcessLevel    /////
////////////////////////////

// export const accessLevelTrigger = atom({
//   key: "accessLevelTrigger",
//   default: 0,
// });

export const useDefaultProfileAtom = atom<boolean>({
  key: "useDefaultProfileAtom",
  default: false,
  //effects_UNSTABLE: [persistAtom],
})

export const accessLevelSelector = selector<AccessLevel>({
  key: `accessLevelSelector/${nanoid()}`,
  get: ({get}) => {
    //get(accessLevelTrigger);
    let accessLevel: AccessLevel = {
      bitwise: 0,
      level: 0,
    }

    const whoami = get(whoamiAtom);
    if (whoami == null && accessLevel.bitwise < LEVEL1) {//test both null and undefined
      accessLevel.level = 0;
      accessLevel.levelStr = 'LEVEL0';
      accessLevel.msg = 'login required';
      console.log("accessLevelSelector ret", accessLevel);
      return accessLevel;
    }
    accessLevel.bitwise = accessLevel.bitwise | SESSION_CHECK;


    //const tfaEnable = whoamiDetail?.whoamiDetail.contents.tfaEnable;
    //const online = whoamiDetail?.whoamiDetail.contents.online;
    const tfaPassed = whoami?.validate; //for now

// test begin
// accessLevel.bitwise = LEVEL3;
// accessLevel.level = 3;
// accessLevel.levelStr = "LEVEL3";
// accessLevel.msg = "welcome";//"socket on required"
// console.log("accessLevelSelector ret", accessLevel);
// return accessLevel;
// test end

    //if ((!whoamiDetail) || (tfaEnable && !tfaPassed && accessLevel.bitwise < LEVEL2))  {
    if (!tfaPassed && accessLevel.bitwise < LEVEL2)  {
      accessLevel.level = 1;
      accessLevel.levelStr = "LEVEL1";
      accessLevel.msg = "tfa pass required";
      console.log("accessLevelSelector ret", accessLevel);
      return accessLevel;
    }
    accessLevel.bitwise = accessLevel.bitwise | TFA_CHECK;

// accessLevel.bitwise = LEVEL3;
// accessLevel.level = 3;
// accessLevel.levelStr = "LEVEL3";
// accessLevel.msg = "welcome";//"socket on required"
// console.log("accessLevelSelector ret", accessLevel);
// return accessLevel;

    const useDefault = get(useDefaultProfileAtom);

    const whoamiDetail = get(whoamiDetailAtom);
    const online = get(onlineSelector);
    //const nickname1 = whoamiDetail?.whoamiDetail.nickname;
    const nickname = get(nicknameAtom); //subscribe nicknameAtom
    //console.log("==nickname==", nickname, " vs ", nickname1, ", full: ", whoamiDetail?.whoamiDetail);

    if (whoamiDetail == null || online == null || online === false || nickname == null ||
        (!useDefault && nickname === '$'+ whoami?.whoami && accessLevel.bitwise < LEVEL3)) {
      accessLevel.level = 2;
      accessLevel.levelStr = "LEVEL2";
      accessLevel.msg = "nickname change required"
      console.log("accessLevelSelector ret", accessLevel);
      return accessLevel;
    }
    accessLevel.bitwise = accessLevel.bitwise | NICKNAME_CHECK;
    //accessLevel.nickname = nickname;

    const avatar = whoamiDetail?.whoamiDetail.avatar;
    //const avatar = get(avatarAtom);

    //console.log("===avatar log===", (!useDefault && avatar === 'avatar.png' && accessLevel.bitwise < LEVEL3), useDefault, avatar, accessLevel)
    if (avatar == null ||
        (!useDefault && avatar === 'avatar.png' && accessLevel.bitwise < LEVEL3)) {
      accessLevel.level = 2;
      accessLevel.levelStr = "LEVEL2";
      accessLevel.msg = "avatar change required"
      console.log("accessLevelSelector ret", accessLevel);
      return accessLevel;
    }
    accessLevel.bitwise = accessLevel.bitwise | AVATAR_CHECK;
    //accessLevel.avatar = avatar.path;
    //accessLevel.avatarImgSrc = avatar.imgsrc;
    //const connected = get(socketConnectedAtom);
    //if (!connected && accessLevel.bitwise < LEVEL4) {
      accessLevel.level = 3;
      accessLevel.levelStr = "LEVEL3";
      accessLevel.msg = "welcome";//"socket on required"
      console.log("accessLevelSelector ret", accessLevel);
      return accessLevel;
    //}

    //online checks socket.on so not using the belowed part for now
    // accessLevel.bitwise = accessLevel.bitwise | SOCKET_CHECK;
    // accessLevel.level = 4;
    // accessLevel.levelStr = "LEVEL4";
    // accessLevel.msg = "member"
    // console.log("accessLevelSelector ret", accessLevel);
    //return accessLevel;
  },

  set: ({set}, newValue) => {
    set(accessLevelAtom, newValue);
  },
  cachePolicy_UNSTABLE: {
    eviction: "most-recent",
  },
});

export const accessLevelAtom = atom<AccessLevel>({
  key: `accessLevelAtom/${nanoid()}`,
  default: accessLevelSelector,
});


////////////////////////


/*
export const myAccessLevelSelectorOri = selector<number>({
  key: 'myAccessLevelSelectorOri',
  get: ({get}) => {
    console.log("myAccessLevelSelectorOri");
    let myAcessLevel = 0;

    const whoami = get(whoamiAtom);
    if (whoami == null) //test both null and undefined
      return myAcessLevel;
    myAcessLevel = myAcessLevel | SESSION_CHECK;

    const whoamiDetail = get(whoamiDetailAtom);
    const tfaEnable = whoamiDetail?.whoamiDetail.contents.tfaEnable;
    const online = whoamiDetail?.whoamiDetail.contents.online;
    const tfaPassed = online; //for now
    if (tfaEnable && !tfaPassed)
      return myAcessLevel;
    myAcessLevel = myAcessLevel | TFA_CHECK;

    const nickname = get(nicknameAtom);
    //console.log("myAccessLevelSelector", nickname, nickname === '$'+ whoami.whoami)
    if (nickname === '$'+ whoami.whoami)
      return myAcessLevel;
    myAcessLevel = myAcessLevel | NICKNAME_CHECK;

    const avatar = whoamiDetail?.whoamiDetail.avatar;
    if (avatar === '$avatar.png')
      return myAcessLevel;
    myAcessLevel = myAcessLevel | AVATAR_CHECK;

    const connected = get(socketConnectedAtom);
    if (!connected)
      return myAcessLevel;
    myAcessLevel = myAcessLevel | SOCKET_CHECK;

    return myAcessLevel;
  },
});
*/

/*
export const myAccessGradeSelector = selector<string>({
  key: 'myAccessGradeSelector',
  get: ({get}) => {
    const myAcessLevel = get(myAccessLevelAtom);

    if (myAcessLevel < LEVEL1)
      return "LEVEL0: login required"
    else if (myAcessLevel < LEVEL2)
      return "LEVEL1: tfa required"  //tfa == online, for now
    else if (myAcessLevel < LEVEL3)
      return "LEVEL2: ->nick and avatar required"
    else if (myAcessLevel < LEVEL4)
      return "LEVEL3: ->socket.open required"
    return "LEVEL4";
  },
});
*/
