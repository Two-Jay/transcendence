import axios  from 'axios';
import { atom, selector } from "recoil";
import { postNicknameApiUrl } from './nicknameType';
import { whoamiAtom, whoamiDetailAtom } from './whoamiState';
import { nanoid } from 'nanoid';

const config = {withCredentials: true,}

export const postNicknameQuery = async (sNickname: string) => {
  const postdata = { data: sNickname}
  let ret;
  try {
    const {data:response} = await axios.post<string>(postNicknameApiUrl, postdata, config)
    ret = sNickname;//response;
    console.log("postNicknameQuery", response, ret);

  } catch (err) {
    console.log("postNicknameQuery catch", err)
  }
  return ret;
}

export const nicknameAtom = atom({
  key: `nicknameAtom/${nanoid()}`,
  default: selector({
    key: `nicknameLoader/${nanoid()}`,
    get: async({get}) => {

      const whoami = get(whoamiAtom);
      if (!whoami) return undefined;

      //return await getNicknameQuery();
      const whoamiDetail = get(whoamiDetailAtom);
      if (!whoamiDetail) return undefined;
      return whoamiDetail.whoamiDetail.nickname;
    },

    //4th try not working again? why? this selector is working for getting just default value
    // set: async ({set}, newValue) => {
    //   console.log("set nicknameAtom", newValue);
    //   if (newValue instanceof DefaultValue) return;
    //   if (newValue === undefined) return;
    //   const newNickname = await postNicknameQuery(newValue)
    //     .then((newVal)=>{
    //       console.log("set await", newVal);
    //       if (newVal != null)
    //       set(nicknameAtom, newVal);

    //     });
    // },

    cachePolicy_UNSTABLE: {
      eviction: "most-recent",
    },
  }),
});


/* //not working, using refetch instead setting
const _nicknameTrigger = atom({
  key: "_nicknameTrigger",
  default: 0,
});

export const nicknameReselector = selector({
  key: 'nicknameReselector',
  get: async() => {
    return await getNicknameQuery();
  },

  set: ({set}) => {
    set(_nicknameTrigger, v=> v+1);
  },

  cachePolicy_UNSTABLE: {
    eviction: "most-recent",
  },

});
*/


//logic is same as atom here so use atom instead
//but, it is useful when using more than one value later
//https://stackoverflow.com/questions/70557677/update-recoil-state-from-async-function
// export const nicknameUpdateSelector = selector({
//   key: 'nicknameUpdateSelector',
//   get: () => {
//     throw new Error("Not implemented !");
//   },

//   //set async is not supported
//   set: ({set}, newValue) => {
//     console.log("nicknameUpdateSelector", newValue);
//     if (newValue != null)
//       set(nicknameAtom, newValue);
//   },

//   cachePolicy_UNSTABLE: {
//     eviction: "most-recent",
//   },

// });




// export const updateNickname = async(inputValue : string) => {
//   try {
//     const newNickname = await postNicknameQuery(inputValue);

//     if (newNickname != null)
//       return newNickname;
//   } catch (error) {
//     console.log(error);
//     //throw new Error(`Error in 'refreshTfa()': ${error}`);
//   }
//   return null;
// }


// export const setNicknameAtom = async(inputValue : string) => {
//   try {
//     const newNickname = await postNicknameQuery(inputValue);
//     if (newNickname != null)
//       RecoilSet(nicknameAtom, newNickname);
//   } catch (error) {
//     console.log(error);
//     //throw new Error(`Error in 'refreshTfa()': ${error}`);
//   }
// }

/*
  //from NicknameComponent
  const updateNicknameAtom = async() => {
    try {
      const newNickname = await postNicknameQuery(inputValue);
      if (newNickname != null)
        setNickname(newNickname);
    } catch (error) {
      console.log(error);
      //throw new Error(`Error in 'refreshTfa()': ${error}`);
    }
    nicknameRefresh();
    //whoamiDetailRefresh();
  }
*/
