import { getWhoamiDetailApiUrl } from "./whoamiType";

//export type Nickname = boolean | undefined;
/*
export type Nickname = {
  nickname: string;
} | undefined;
*/

export const getNicknameApiUrl = getWhoamiDetailApiUrl;
export const postNicknameApiUrl = "/sapi/auth/updateNickname";

