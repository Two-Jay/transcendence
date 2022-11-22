import { getWhoamiDetailApiUrl } from "./whoamiType";

//export type TfaEnable = boolean | undefined;
/*
export type TfaEnable = {
  tfaEnable: boolean;
} | undefined;
*/

export const getTfaEnableApiUrl = getWhoamiDetailApiUrl;
export const postTfaEnableApiUrl = "/sapi/auth/tfaEnable";

