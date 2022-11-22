import { WhoamiDetail } from './whoamiType';
import axios  from 'axios';
import { atom, selector } from "recoil";
import { getTfaEnableApiUrl, postTfaEnableApiUrl } from './tfaEnableType';
import { nanoid } from 'nanoid';

const config = {withCredentials: true,}

const getTfaEnableQuery = async () => {
  let ret;
  try {
    const {data:response} = await axios.get<WhoamiDetail>(getTfaEnableApiUrl, config);
    ret = response?.whoamiDetail.contents.tfaEnable;
    console.log("getTfaEnableQuery", ret);
  } catch (err) {
    console.log("getTfaEnableQuery catch", err);
    //throw new Error(  `Error in 'updateTfaEnable()': ${err}` );
  }
  return ret;
}

export const postTfaEnableQuery = async (bOnOff: boolean) => {
  const postdata = { data: bOnOff}
  let ret;
  try {
    const {data:response} = await axios.post(postTfaEnableApiUrl, postdata, config)
    ret = bOnOff;//response?.tfaEnable
    console.log("postTfaEnableQuery", response, ret);

  } catch (err) {
    console.log("postTfaEnableQuery catch", err)
  }
  return ret;
}

export const tfaEnableAtom = atom({
  key: `tfaEnableAtom/${nanoid()}`,
  default: selector({
    key: `tfaEnableLoader/${nanoid()}`,
    get: async() => {
      return await getTfaEnableQuery();
    },

    //4th try not working again? why? this selector is working for getting just default value
    // set: async ({set}, newValue) => {
    //   if (newValue instanceof DefaultValue) return;
    //   if (newValue === undefined) return;
    //   const newTfaEnable = await postTfaEnableQuery(newValue)
    //     .then((newVal)=>{
    //       if (newVal != null)
    //       set(tfaEnableAtom, newVal);
    //     });
    // },

    cachePolicy_UNSTABLE: {
      eviction: "most-recent",
    },
  }),
});

// export const tfaEnableUpdateSelector = selector({
//   key: 'tfaEnableUpdateSelector',
//   get: () => {
//     throw new Error("Not implemented !");
//   },

//   //set async is not supported
//   set: ({set}, newValue) => {
//     console.log("tfaEnableUpdateSelector", newValue);

//     if (newValue != null)
//       set(tfaEnableAtom, newValue);
//   },

//   cachePolicy_UNSTABLE: {
//     eviction: "most-recent",
//   },

// });


// export const updateTfaEnable = async(newChecked : boolean) => {
//   try {
//     const newTfa = await postTfaEnableQuery(newChecked);
//     if (newTfa != null)
//       return newTfa;
//   } catch (error) {
//     console.log(error);
//     //throw new Error(`Error in 'refreshTfa()': ${error}`);
//   }
//   return null;
// }




// export const setTfaEnableAtom = async(newChecked : boolean) => {
//   try {
//     const newTfa = await postTfaEnableQuery(newChecked);
//     if (newTfa != null)
//       RecoilSet(tfaEnableAtom, newTfa);
//   } catch (error) {
//     console.log(error);
//     //throw new Error(`Error in 'refreshTfa()': ${error}`);
//   }
// }

/*
  //from TfaComponent
  const updateTfaEnableAtom = async() => {
    try {
      const newTfa = await postTfaEnableQuery(newChecked);
      if (newTfa != null)
        setTfaEnable(newTfa);
    } catch (error) {
      console.log(error);
      //throw new Error(`Error in 'refreshTfa()': ${error}`);
    }
    tfaEnableRefresh();
  }
*/
