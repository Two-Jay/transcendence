export const SESSION_CHECK =  1;          //00001  -> 1
export const TFA_CHECK =      1 << 1;     //00010  -> 2
export const NICKNAME_CHECK = 1 << 2;     //00100  -> 4
export const AVATAR_CHECK =   1 << 3;     //01000  -> 8
export const SOCKET_CHECK =   1 << 4;     //10000  -> 16

export const LEVEL0 = 0;                                      // 0
export const LEVEL1 = SESSION_CHECK;                          // 1
export const LEVEL2 = LEVEL1 | TFA_CHECK;                     // 3
export const LEVEL3 = LEVEL2 | NICKNAME_CHECK | AVATAR_CHECK; //15
export const LEVEL4 = LEVEL3 | SOCKET_CHECK;                  //31


export interface AccessLevel  {
  bitwise: number;
  level: number;
  levelStr?: string;
  msg?: string;
  // nickname: string;
  // avatar:string;
  // avatarImgSrc:string;
}

//https://velog.io/@design0728/자바스크립트-비트연산-실제로-활용하기
/* add attributes

if (sessionChecked === true)
  myAcessLevel = myAcessLevel | SESSION_CHECK;

if (tfaChecked === true)
  myAcessLevel = myAcessLevel | TFA_CHECK;

if (nickChanged === true)
  myAcessLevel = myAcessLevel | NICK_CHECK;

if (avatarChanged === true)
  myAcessLevel = myAcessLevel | AVATAR_CHECK;

if (otherChanged === true)
  myAcessLevel = myAcessLevel | OTHER_CHECK;

*/

/* check attributes

//has any of the attributes
if (myAcessLevel & (NICK_CHECK | AVATAR_CHECK | OTHER_CHECK))
  do something

//has only the attributes
if (myAcessLevel === 0)
  go to index
if (myAcessLevel == (SESSION_CHECK))
  do tfa check

if (myAcessLevel == (SESSION_CHECK | TFA_CHECK))
  do nick and avatar check

if (myAcessLevel ==  (SESSION_CHECK | TFA_CHECK | NICK_CHECK | AVATAR_CHECK))
  do something

//has all the attributes
if (myAcessLevel ==  (myAcessLevel | SESSION_CHECK | TFA_CHECK | NICK_CHECK | AVATAR_CHECK | OTHER_CHECK))
  do something

*/



////////////////////////////
/////  whoami          /////
////////////////////////////
/*
export class TokenData {
  public login: string;
  public validate: boolean;
}
*/

export type Whoami = {
  whoami?: string;
  validate?: boolean;
} | undefined;

export const getWhoamiApiUrl = "/sapi/auth/whoami";

////////////////////////////
/////  whoamiDetail    /////
////////////////////////////

export type WhoamiDetail = {
  whoamiDetail: {
    login: string;
    nickname: string;
    avatar: string;
    contents: {
      tfaEnable: boolean;
      online: boolean;
    };
  }
} | undefined;

export const getWhoamiDetailApiUrl = "/sapi/auth/whoamiDetail";

