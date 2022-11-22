
import { atom, selector } from "recoil";
import { FToast } from "./toastType";




// export const toastsAtom = atom<FToast[]>({
//   key: 'toastsAtom',
//   default: [
//     // {
//     // id: nanoid(),
//     // type: ToastType.HiFire,
//     // msg: "Set yourself free.",}
//   ]
// })

export const toastMapAtom = atom<Map<string, FToast>>({
  key: 'toastMapAtom',
  default: selector<Map<string, FToast>>({
    key: "toastMapLoader",
    get: () => {
      const toastMap = new Map<string, FToast>();
      // const key = nanoid();
      // const toast : ToastItem = {
      //   id: nanoid(),
      //   type: ToastType.HiFire,
      //   msg: "Set yourself free.",}
      // toastMap.set(key, toast);
      return toastMap;
    }
  })
})
