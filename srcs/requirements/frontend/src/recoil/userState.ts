import { nanoid } from 'nanoid';
import axios from "axios";
import { atom, selector } from "recoil";
import { postBlockApiUrl, postFriendApiUrl, postWhoisblockApiUrl, postWhoisfriendApiUrl, User } from "./userType";
// import { recoilPersist } from 'recoil-persist'

// const { persistAtom } = recoilPersist({
//   key: 'persistUserMapAtom',
//   //storage: localStorage,
// })

const config = {withCredentials: true,}

export const postFriendQuery = async (login: string, add: boolean) => {
  const postdata = { friend_login: login, add: add }
  let ret;
  try {
    const {data:response} = await axios.post(postFriendApiUrl, postdata, config)
    ret = response.result;
    console.log("postFriendQuery", add, response, ret);

  } catch (err) {
    console.log("postFriendQuery catch", err)
  }
  return ret;
}

export const postBlockQuery = async (login: string, add: boolean) => {
  const postdata = { block_login: login, add: add }
  let ret;
  try {
    const {data:response} = await axios.post(postBlockApiUrl, postdata, config)
    ret = response.result;
    console.log("postBlockQuery", add, response, ret);

  } catch (err) {
    console.log("postBlockQuery catch", err)
  }
  return ret;
}

export const postWhoisfriendQuery = async (login: string) => {
  const postdata = { data: login }
  let ret;
  try {
    const {data:response} = await axios.post(postWhoisfriendApiUrl, postdata, config)
    ret = response.result;
    //console.log("postWhoisfriendQuery", response, ret);

  } catch (err) {
    console.log("postWhoisfriendQuery catch", err)
  }
  return ret;
}

export const postWhoisblockQuery = async (login: string) => {
  const postdata = { data: login }
  let ret;
  try {
    const {data:response} = await axios.post(postWhoisblockApiUrl, postdata, config)
    ret = response.result;
    //console.log("postWhoisblockQuery", response, ret);

  } catch (err) {
    console.log("postWhoisblockQuery catch", err)
  }
  return ret;
}





export const userMapAtom = atom<Map<string, User>>({
  key: `userMapAtom/${nanoid()}`,
  default: selector<Map<string, User>>({
    key: `userMapLoader/${nanoid()}`,
    get: () => {
      const userMap = new Map<string, User>();
      return userMap;
    },
  }),
  //effects_UNSTABLE: [persistAtom],
});

