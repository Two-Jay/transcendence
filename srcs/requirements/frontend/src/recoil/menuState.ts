import { atom } from "recoil";

//when clicking 42 image on the menubar, sidebar changes to the icon mode
export const collapsedSidebarState = atom<boolean>({
  key: 'collapsedSidebar',
  default: false
});

//when redirecting to a url, don't allow to do it again
export const pushingState = atom<boolean>({
  key: 'pushing',
  default: false
});
