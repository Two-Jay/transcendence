import { nanoid } from "nanoid";


export enum ToastType {
  NoIcon = "NoIcon",
  HiFire = 'HiFire',
  HiCheck = 'HiCheck',
  HiX = 'HiX',
  HiExclamation = 'HiExclamation',
  FaTelegramPlane = 'FaTelegramPlane',
  RiPingPongFill = 'RiPingPongFill',
};

export enum ToastButtonType {
  NoButton = 'NoButton',
  O = 'O',
  X = 'X',
  Pong = 'Pong',
};

// export interface IToast {
//   readonly id : string;// = nanoid();
//   readonly type: ToastType; // = ToastType.HiCheck;
//   readonly msg: string; // = "hello";
//   readonly duration: number;
//   readonly finishTime: number;
// }

// export function createToast(id: string, type: ToastType, msg: string, duration: number) {
//   return {
//     id,
//     type,
//     msg,
//     duration: duration,
//     finishTime : duration + Math.floor(Date.now() / 1000),
//   }
// }

//export class FToast implements IToast {
export class FToast {
  public readonly finishTime: number;
  public msgout: string;
  constructor(
    public readonly id : string = nanoid(),
    public readonly type: ToastType = ToastType.HiCheck,
    public readonly msg: string = "new msg, " + id,
    public duration: number = 10,
    public readonly buttonType: ToastButtonType = ToastButtonType.X,
    public onClick?: Function,
    public onTimeout?: Function,
  ) {
    this.finishTime = this.duration + Math.floor(Date.now() / 1000),
    this.msgout = this.msg;
  }

  public isValid() : boolean {
    const now = Math.floor(Date.now() / 1000);
    if (this.finishTime > now) {
      if (this.finishTime - now < 60)
        this.msgout = this.msg + " (" + (this.finishTime - now) + " sec)";
      return true;
    }
    return false;
  }
}
