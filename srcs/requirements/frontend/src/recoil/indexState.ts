import { ParsedUrlQuery } from "querystring";
import { atom } from "recoil";

export const indexQueryState = atom<ParsedUrlQuery>({
    key: 'indexQuery',
  default: {}
});
