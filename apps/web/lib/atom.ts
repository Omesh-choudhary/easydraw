import { atom } from "recoil";

export const activeTool = atom<string>({
  key: "activeTool",
  default: "rectangle",
});
